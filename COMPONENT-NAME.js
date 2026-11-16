/**
 * ComponentNameElement - COMPONENT_DESCRIPTION
 *
 * @element COMPONENT-NAME
 *
 * @attr {string} example-attribute - Description of the attribute
 *
 */
export class ComponentNameElement extends HTMLElement {
	static get observedAttributes() {
		return ['example-attribute'];
	}

	constructor() {
		super();
		this._internals = {
			isRendered: false,
		};
	}

	connectedCallback() {
		this._upgradeProperty('exampleAttribute');
		this.render();
	}

	attributeChangedCallback(name, oldValue, newValue) {
		// Only handle side effects, avoid full re-render
		// The property getter will read from the attribute
		if (oldValue === newValue) {
			return;
		}

		switch (name) {
			case 'example-attribute':
				// Handle side effects (e.g., update ARIA attributes, dispatch events)
				// Don't re-render the entire component unless necessary
				// Example: this.setAttribute('aria-label', newValue);

				// Dispatch events for internal state changes, not for host-set properties
				// Only dispatch if the change came from internal component activity
				if (this._internals.isRendered) {
					// Example pattern (commented out by default):
					// this.dispatchEvent(new CustomEvent('COMPONENT-NAME:change', {
					//   detail: { exampleAttribute: newValue },
					//   bubbles: true,
					//   composed: true
					// }));
				}
				break;
		}
	}

	/**
	 * Upgrade a property to handle cases where it was set before the element upgraded.
	 * This is especially important for framework compatibility.
	 * @param {string} prop - Property name to upgrade
	 * @private
	 */
	_upgradeProperty(prop) {
		if (Object.prototype.hasOwnProperty.call(this, prop)) {
			const value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}

	/**
	 * Example attribute as a property.
	 * Reflects between property and attribute to keep them in sync.
	 */
	get exampleAttribute() {
		return this.getAttribute('example-attribute');
	}

	set exampleAttribute(value) {
		// Reflect property to attribute
		if (value === null || value === undefined) {
			this.removeAttribute('example-attribute');
		} else {
			this.setAttribute('example-attribute', value);
		}
	}

	render() {
		this._internals.isRendered = true;
	}
}
