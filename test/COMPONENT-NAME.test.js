import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readFile } from 'node:fs/promises';
import { ComponentNameElement } from '../COMPONENT-NAME.js';

const elementName = 'COMPONENT-NAME'.toLowerCase();

describe('ComponentNameElement', () => {
	let element;

	beforeEach(async () => {
		element = document.createElement(elementName);
		document.body.appendChild(element);
		await new Promise((resolve) => requestAnimationFrame(resolve));
	});

	afterEach(() => {
		element.remove();
	});

	it('should be defined', () => {
		expect(customElements.get(elementName)).toBe(ComponentNameElement);
	});

	it('should create an instance', () => {
		expect(element).toBeInstanceOf(ComponentNameElement);
		expect(element).toBeInstanceOf(HTMLElement);
	});

	it('describes entry points as manifest modules rather than class members', async () => {
		const manifest = JSON.parse(
			await readFile('custom-elements.json', 'utf8'),
		);
		expect(manifest.modules.map(({ path }) => path)).toEqual([
			'COMPONENT-NAME.js',
			'define.js',
			'index.js',
		]);
		const component = manifest.modules[0].declarations[0];
		expect(component.members.map(({ kind }) => kind)).toEqual([
			'field',
			'method',
		]);
	});

	describe('Progressive enhancement', () => {
		it('preserves authored content and entered values through rendering and reconnection', () => {
			const label = document.createElement('label');
			label.textContent = 'Your name';
			const input = document.createElement('input');
			label.appendChild(input);
			element.appendChild(label);
			input.value = 'Entered before enhancement';

			element.render();
			element.remove();
			document.body.appendChild(element);

			expect(element.shadowRoot).toBeNull();
			expect(element.firstChild).toBe(label);
			expect(input.value).toBe('Entered before enhancement');
			expect(element.querySelector('input')).toBe(input);
		});

		it('preserves authored global attributes', () => {
			element.setAttribute('hidden', '');
			element.setAttribute('role', 'group');
			element.setAttribute('tabindex', '-1');
			element.remove();
			document.body.appendChild(element);
			element.render();
			expect(element.hidden).toBe(true);
			expect(element.getAttribute('role')).toBe('group');
			expect(element.getAttribute('tabindex')).toBe('-1');
		});
	});

	describe('Attributes and Properties', () => {
		it('should reflect attribute to property', () => {
			element.setAttribute('example-attribute', 'test-value');
			expect(element.exampleAttribute).toBe('test-value');
		});

		it('should reflect property to attribute', () => {
			element.exampleAttribute = 'property-value';
			expect(element.getAttribute('example-attribute')).toBe(
				'property-value',
			);
		});

		it('should remove attribute when property set to null', () => {
			element.exampleAttribute = 'test';
			expect(element.hasAttribute('example-attribute')).toBe(true);

			element.exampleAttribute = null;
			expect(element.hasAttribute('example-attribute')).toBe(false);
		});

		it('should remove attribute when property set to undefined', () => {
			element.exampleAttribute = 'test';
			expect(element.hasAttribute('example-attribute')).toBe(true);

			element.exampleAttribute = undefined;
			expect(element.hasAttribute('example-attribute')).toBe(false);
		});

		it('upgrades a property assigned before definition without leaving a shadowing own property', () => {
			const lateName = `${elementName}-late`;
			const uninitializedElement = document.createElement(lateName);
			uninitializedElement.exampleAttribute = 'early-value';
			document.body.appendChild(uninitializedElement);

			try {
				customElements.define(
					lateName,
					class extends ComponentNameElement {},
				);
				expect(uninitializedElement.exampleAttribute).toBe(
					'early-value',
				);
				expect(
					Object.hasOwn(uninitializedElement, 'exampleAttribute'),
				).toBe(false);
				expect(
					uninitializedElement.getAttribute('example-attribute'),
				).toBe('early-value');

				uninitializedElement.exampleAttribute = 'updated-value';
				expect(
					uninitializedElement.getAttribute('example-attribute'),
				).toBe('updated-value');
			} finally {
				uninitializedElement.remove();
			}
		});
	});

	// Add more tests here
});
