import { beforeAll } from 'vitest';
import { ComponentNameElement } from '../COMPONENT-NAME.js';

// Define the custom element before tests run
beforeAll(() => {
	// Use a valid custom element name for testing the template
	const tagName = 'component-name';

	if (!customElements.get(tagName)) {
		customElements.define(tagName, ComponentNameElement);
	}

	// Make the class available globally for testing static methods
	globalThis.ComponentNameElement = ComponentNameElement;
});
