import { readFile } from 'node:fs/promises';
import { test, expect } from '@playwright/test';

const source = await readFile(
	new URL('../../COMPONENT-NAME.js', import.meta.url),
	'utf8',
);
const definition = await readFile(
	new URL('../../define.js', import.meta.url),
	'utf8',
);
const entry = await readFile(
	new URL('../../index.js', import.meta.url),
	'utf8',
);
const { name } = JSON.parse(
	await readFile(new URL('../../package.json', import.meta.url), 'utf8'),
);
const tag = name.split('/').pop().toLowerCase();
const markup = `<!doctype html><html lang="en"><title>Enhancement contract</title>
	<form><${tag}>
		<label for="name">Name</label><input id="name" name="name">
	</${tag}></form></html>`;

test('preserves native form content, focus, and pre-definition properties during upgrade', async ({
	page,
}) => {
	await page.route('http://starter.test/**', (route) =>
		route.fulfill({
			contentType: route.request().url().endsWith('.js')
				? 'text/javascript'
				: 'text/html',
			body: route.request().url().endsWith('/define.js')
				? definition
				: route.request().url().endsWith('/index.js')
					? entry
					: route.request().url().endsWith('.js')
						? source
						: markup,
		}),
	);
	await page.goto('http://starter.test/');
	const field = page.getByRole('textbox', { name: 'Name', exact: true });
	await field.fill('Entered before upgrade');
	await page.locator(tag).evaluate((element) => {
		element.exampleAttribute = 'early-value';
	});

	expect(
		await page.evaluate(async (elementName) => {
			const moduleURL = new URL('/index.js', location.href).href;
			const { ComponentNameElement } = await import(moduleURL);
			return {
				exportedClass: typeof ComponentNameElement,
				registered: Boolean(customElements.get(elementName)),
			};
		}, tag),
	).toEqual({ exportedClass: 'function', registered: false });

	await page.evaluate(async (elementName) => {
		const moduleURL = new URL('/define.js', location.href).href;
		await import(moduleURL);
		await customElements.whenDefined(elementName);
	}, tag);

	await expect(field).toBeFocused();
	await expect(field).toHaveValue('Entered before upgrade');
	await expect(page.locator(tag)).toHaveAttribute(
		'example-attribute',
		'early-value',
	);
	expect(
		await page.locator(tag).evaluate((element) => ({
			hasShadow: element.shadowRoot !== null,
			shadowsProperty: Object.hasOwn(element, 'exampleAttribute'),
			value: new FormData(element.closest('form')).get('name'),
		})),
	).toEqual({
		hasShadow: false,
		shadowsProperty: false,
		value: 'Entered before upgrade',
	});

	await page.locator(tag).evaluate((element) => {
		element.render();
		element.remove();
		document.querySelector('form').appendChild(element);
		element.exampleAttribute = 'after-reconnection';
	});
	await expect(field).toHaveValue('Entered before upgrade');
	await expect(page.locator(tag)).toHaveAttribute(
		'example-attribute',
		'after-reconnection',
	);
	await page.locator(tag).evaluate((element) => {
		element.hidden = true;
	});
	await expect(field).toBeHidden();
});

test('keeps the authored field usable without JavaScript', async ({
	browser,
}) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	try {
		const page = await context.newPage();
		await page.setContent(markup);
		await page.keyboard.press('Tab');
		const field = page.getByRole('textbox', { name: 'Name', exact: true });
		await expect(field).toBeFocused();
		await field.fill('Native fallback');
		await expect(field).toHaveValue('Native fallback');
	} finally {
		await context.close();
	}
});
