import { ComponentNameElement } from './COMPONENT-NAME.js';

/**
 * Registers the ComponentNameElement with the custom elements registry
 * @param tagName - The custom element tag name to register (defaults to 'COMPONENT-NAME')
 * @returns true if registration was successful, false if customElements is not available
 */
export function defineComponentName(tagName?: string): boolean;

export { ComponentNameElement };
