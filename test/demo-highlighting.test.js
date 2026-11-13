import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import {
	copyFileSync,
	cpSync,
	existsSync,
	mkdirSync,
	readFileSync,
	rmSync,
	writeFileSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const original = {
	index: [
		'ae12f77ebbdf5989814d2f6a48051dcae5702441cc0f2e5b71a8268ad1b86fce',
		'1f88ee07a576f877a5bcef78d5503b77dee47b342f8d75b21668176d2e21f4dc',
	],
	esm: ['4a57ec6b79577ba28260bfd2090d75edf5a4bfd5a5c8b1acc8cf92f8fea231a7'],
	unpkg: ['5477ee755ba9b916a2c5fdc251ad1db8ef334045955ed964aa2870e80f8d8f90'],
};
const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const snippets =
	/<\/?[\w]+-[\w-]+\b[^>]*>|import\b[\s\S]*?;|customElements\.(?:get|define)\([^)]*\);?|defineComponentName\(\);/g;
const placeholder = ['COMPONENT', 'NAME'].join('-');
const hash = (text, pkg = manifest) => {
	const tag = pkg.name.split('/').pop();
	const className =
		tag === placeholder
			? 'ComponentNameElement'
			: tag
					.split('-')
					.map((word) => word[0].toUpperCase() + word.slice(1))
					.join('') + 'Element';
	return createHash('sha256')
		.update(
			text
				.replaceAll(
					`https://esm.sh/${pkg.name}@${pkg.version}/`,
					`https://esm.sh/${pkg.name}@VERSION/`,
				)
				.replaceAll(tag, placeholder)
				.replaceAll(className, 'ComponentNameElement'),
		)
		.digest('hex');
};

function check(html, name, pkg = manifest) {
	const template = document.createElement('template');
	template.innerHTML = html;
	const blocks = [...template.content.querySelectorAll('pre code')];
	expect(blocks).toHaveLength(original[name].length);
	for (const [index, code] of blocks.entries()) {
		expect(hash(code.textContent, pkg)).toBe(original[name][index]);
		const expected = [...code.textContent.matchAll(snippets)].map(
			([text]) => text,
		);
		expect(expected.length).toBeGreaterThan(0);
		expect(
			[...code.querySelectorAll('mark')].map((mark) => mark.textContent),
		).toEqual(expected);
		expect(code.querySelector('mark mark')).toBeNull();
		expect(code.querySelectorAll(':scope > :not(mark)')).toHaveLength(0);
	}
}

describe('displayed component code', () => {
	it('accepts a future version written by the retained publishing helper', () => {
		const fixture = `test/.demo-version-${process.pid}`;
		try {
			mkdirSync(`${fixture}/scripts`, { recursive: true });
			mkdirSync(`${fixture}/demo`);
			const future = { ...manifest, version: '99.12.3' };
			writeFileSync(`${fixture}/package.json`, JSON.stringify(future));
			copyFileSync('demo/esm.html', `${fixture}/demo/esm.html`);
			copyFileSync(
				'scripts/update-demo-versions.js',
				`${fixture}/scripts/update-demo-versions.js`,
			);
			execFileSync(process.execPath, [
				`${fixture}/scripts/update-demo-versions.js`,
			]);
			const html = readFileSync(`${fixture}/demo/esm.html`, 'utf8');
			expect(
				html.split(`${future.name}@${future.version}/`),
			).toHaveLength(3);
			check(html, 'esm', future);
		} finally {
			rmSync(fixture, { recursive: true, force: true });
		}
	});

	it.skipIf(!existsSync('scripts/setup.js'))(
		'keeps the contracts valid after the real setup wizard initializes a component',
		async () => {
			const fixture = `test/.demo-setup-${process.pid}`;
			try {
				mkdirSync(`${fixture}/test`, { recursive: true });
				mkdirSync(`${fixture}/bin`);
				for (const path of [
					'scripts',
					'demo',
					'package.json',
					'README.tpl',
					'COMPONENT-NAME.js',
					'COMPONENT-NAME.d.ts',
					'index.js',
					'define.js',
					'custom-elements.json',
					'test/setup.js',
					'test/COMPONENT-NAME.test.js',
				]) {
					cpSync(path, `${fixture}/${path}`, { recursive: true });
				}
				// Exercise the real substitutions and cleanup, without installing packages or committing fixtures.
				for (const command of ['npm', 'git']) {
					writeFileSync(
						`${fixture}/bin/${command}`,
						'#!/bin/sh\nexit 0\n',
						{ mode: 0o755 },
					);
				}
				await new Promise((resolveSetup, reject) => {
					const child = spawn(
						process.execPath,
						['scripts/setup.js'],
						{
							cwd: fixture,
							env: {
								...process.env,
								PATH: `${resolve(fixture, 'bin')}:${process.env.PATH}`,
							},
						},
					);
					let output = '';
					let named = false;
					let described = false;
					child.stdout.on('data', (data) => {
						output += data;
						if (!named && output.includes('Component name (')) {
							named = true;
							child.stdin.write('form-highlight-check\n');
						}
						if (
							!described &&
							output.includes('Component description:')
						) {
							described = true;
							child.stdin.end(
								'A highlighting contract fixture.\n',
							);
						}
					});
					child.stderr.on('data', (data) => {
						output += data;
					});
					child.on('error', reject);
					child.on('close', (code) =>
						code === 0 ? resolveSetup() : reject(new Error(output)),
					);
				});
				const generated = JSON.parse(
					readFileSync(`${fixture}/package.json`, 'utf8'),
				);
				expect(generated.name).toBe(
					'@aarongustafson/form-highlight-check',
				);
				expect(generated.scripts.version).toBe(
					manifest.scripts.version,
				);
				expect(generated.scripts.postversion).toBe(
					manifest.scripts.postversion,
				);
				for (const name of Object.keys(original)) {
					check(
						readFileSync(`${fixture}/demo/${name}.html`, 'utf8'),
						name,
						generated,
					);
				}
			} finally {
				rmSync(fixture, { recursive: true, force: true });
			}
		},
	);

	it('keeps displayed and runnable CDN versions aligned with publishing automation', () => {
		const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
		const esm = readFileSync('demo/esm.html', 'utf8');
		expect(esm.split(`${manifest.name}@${manifest.version}/`)).toHaveLength(
			3,
		);
		expect(manifest.scripts.version).toBe(
			'node scripts/update-demo-versions.js && git add demo/esm.html',
		);
		expect(manifest.scripts.postversion).toBe('git push --follow-tags');
	});

	it.each(['index', 'esm', 'unpkg'])(
		'%s marks each component snippet without changing copyable text',
		(name) => {
			check(readFileSync(`demo/${name}.html`, 'utf8'), name);
		},
	);
});
