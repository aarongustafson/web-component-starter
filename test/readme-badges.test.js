import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';

it('documents the five package badges with matching package and repository links', async () => {
	const pkg = JSON.parse(await readFile('package.json', 'utf8'));
	const repo = pkg.repository.url.replace(/^git\+/, '').replace(/\.git$/, '');
	const ownerRepo = new URL(repo).pathname.slice(1);
	const types = pkg.types.replace(/^\.\//, '');
	const source = await readFile(
		existsSync('README.tpl') ? 'README.tpl' : 'README.md',
		'utf8',
	);
	const badges = [
		...source.matchAll(/^\[!\[([^\]]+)\]\(([^)]+)\)\]\(([^)]+)\)$/gm),
	].map((match) => match.slice(1));
	expect(badges).toEqual([
		[
			'npm version',
			`https://img.shields.io/npm/v/${pkg.name}.svg`,
			`https://www.npmjs.com/package/${pkg.name}`,
		],
		[
			'CI status',
			`https://img.shields.io/github/actions/workflow/status/${ownerRepo}/ci.yml?branch=main&label=CI`,
			`${repo}/actions/workflows/ci.yml`,
		],
		[
			'Minified + gzipped size',
			`https://img.shields.io/bundlejs/size/${pkg.name}?format=minzip&label=min%2Bgzip`,
			`https://bundlejs.com/?q=${pkg.name}`,
		],
		[
			'License',
			`https://img.shields.io/npm/l/${pkg.name}`,
			`${repo}/blob/main/LICENSE`,
		],
		[
			'Type definitions',
			`https://img.shields.io/npm/types/${pkg.name}`,
			`${repo}/blob/main/${types}`,
		],
	]);
});
