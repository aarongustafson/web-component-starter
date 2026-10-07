import { beforeAll } from 'vitest';
import { ComponentNameElement } from '../COMPONENT-NAME.js';

const elementName = 'COMPONENT-NAME'.toLowerCase();

// Define the custom element before tests run
beforeAll(() => {
	if (!customElements.get(elementName)) {
		customElements.define(elementName, ComponentNameElement);
	}

	// Make the class available globally for testing static methods
	globalThis.ComponentNameElement = ComponentNameElement;
});
