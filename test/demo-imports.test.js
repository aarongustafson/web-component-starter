import { readFile } from 'node:fs/promises';
import { expect, it } from 'vitest';

it('shows copyable module-script wrappers around the CDN registration code', async () => {
	for (const file of ['esm.html', 'unpkg.html']) {
		const template = document.createElement('template');
		template.innerHTML = await readFile(`demo/${file}`, 'utf8');
		const displayed = template.content
			.querySelector('pre code')
			.textContent.match(/<script type="module">([\s\S]*?)<\/script>/);
		expect(
			displayed,
			`${file}: include the native module wrapper`,
		).not.toBeNull();
		const actual = template.content.querySelector('script[type="module"]');
		expect(displayed[1].replace(/\s+/g, ' ').trim()).toBe(
			actual.textContent.replace(/\s+/g, ' ').trim(),
		);
	}
});
