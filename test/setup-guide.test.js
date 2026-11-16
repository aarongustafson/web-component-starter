import { spawn } from 'node:child_process';
import {
	copyFile,
	mkdtemp,
	mkdir,
	readFile,
	rm,
	writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';

it('substitutes the generated element name in the retained styling guide', async () => {
	const root = await mkdtemp(join(tmpdir(), 'starter-guide-'));
	try {
		await mkdir(join(root, 'scripts'));
		await mkdir(join(root, 'test'));
		await mkdir(join(root, '.git'));
		for (const file of [
			'scripts/setup.js',
			'WEB-COMPONENTS-BEST-PRACTICES.md',
			'COMPONENT-NAME.js',
			'COMPONENT-NAME.d.ts',
			'test/COMPONENT-NAME.test.js',
			'test/setup-guide.test.js',
		]) {
			await copyFile(file, join(root, file));
		}
		await writeFile(
			join(root, 'package.json'),
			JSON.stringify({
				type: 'module',
				scripts: { setup: 'node scripts/setup.js' },
			}),
		);
		await writeFile(
			join(root, 'skip-install.cjs'),
			`const childProcess = require('node:child_process');
childProcess.execSync = (command) => {
	if (command !== 'npm install') throw new Error('Unexpected command: ' + command);
};
require('node:module').syncBuiltinESMExports();
`,
		);
		await new Promise((resolve, reject) => {
			const child = spawn(
				process.execPath,
				['--require', './skip-install.cjs', 'scripts/setup.js'],
				{ cwd: root, stdio: ['pipe', 'pipe', 'pipe'] },
			);
			let output = '';
			let named = false;
			let described = false;
			child.on('error', reject);
			child.stdout.on('data', (data) => {
				output += data;
				if (!named && output.includes('Component name (')) {
					named = true;
					child.stdin.write('form-guide-fixture\n');
				}
				if (!described && output.includes('Component description:')) {
					described = true;
					child.stdin.write('A styling guide fixture.\n');
				}
			});
			child.stderr.on('data', (data) => {
				output += data;
			});
			child.on('close', (code) => {
				if (code !== 0) reject(new Error(output));
				else resolve();
			});
		});
		const guide = await readFile(
			join(root, 'WEB-COMPONENTS-BEST-PRACTICES.md'),
			'utf8',
		);
		expect(guide).toContain('form-guide-fixture {');
		expect(guide).toContain('form-guide-fixture[hidden] {');
		expect(guide).not.toContain('COMPONENT-NAME');
		await expect(
			readFile(join(root, 'test/setup-guide.test.js')),
		).rejects.toMatchObject({ code: 'ENOENT' });
	} finally {
		await rm(root, { recursive: true, force: true });
	}
});
