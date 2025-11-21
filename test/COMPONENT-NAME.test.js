import { describe, it, expect, beforeEach } from 'vitest';
import { ComponentNameElement } from '../COMPONENT-NAME.js';

describe('ComponentNameElement', () => {
	let element;

	beforeEach(() => {
		element = document.createElement('COMPONENT-NAME');
		document.body.appendChild(element);
	});

	it('should be defined', () => {
		expect(customElements.get('COMPONENT-NAME')).toBe(
			ComponentNameElement,
		);
	});

	it('should create an instance', () => {
		expect(element).toBeInstanceOf(ComponentNameElement);
		expect(element).toBeInstanceOf(HTMLElement);
	});

	it('should have a shadow root', () => {
		expect(element.shadowRoot).toBeTruthy();
	});

	// Add more tests here
});
