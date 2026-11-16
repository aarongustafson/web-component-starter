# Web Components Best Practices

This template incorporates best practices from Google's [Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices) guide. This document explains the patterns used in the template and why they're important.

## Light DOM first

The starter enhances authored light-DOM content. Its initialization hook doesn’t
replace children, so native controls, labels, document styles, and entered values
remain intact. Content is available before definition and when JavaScript fails.

Don’t introduce shadow DOM just because the component is a custom element. Use
it when encapsulation solves a concrete problem, agree on the tradeoffs first,
and document the supported styling hooks and form behavior.

### Preserve structure and native behavior

Initialize stable structure once and update only the text, attributes, and state
that changed. Don’t replace authored children to update configuration. Check
focus, form participation, labels, and data preservation in real browsers.

Respect authored `hidden`, `role`, and `tabindex` attributes. The starter adds no
display style. If you add one, preserve native hiding with a scoped rule:

```css
COMPONENT-NAME {
  display: block;
}

COMPONENT-NAME[hidden] {
  display: none;
}
```

### Keep state and styles owned by the component

Use native interaction selectors such as `:focus-visible` and `:disabled`
instead of mirroring them in JavaScript. Keep author configuration in documented
attributes and properties. For derived styling state, consider
`ElementInternals.states` and `:state()`; custom states work with light DOM too.
They don’t supply accessibility semantics or replace native behavior.

If shadow DOM is justified, create the root in the constructor and choose an
explicit styling API. Shared constructed stylesheets can avoid per-instance
style nodes, but measure the benefit before migrating. Shared mutations affect
every adopter, and constructed stylesheets can only be adopted within their
creating document. Don’t copy arbitrary document stylesheets into a shadow root.

### Plan connection and cleanup together

The starter performs synchronous property upgrade and initialization. It installs
no listeners, observers, or scheduled work. When adding those resources, clean
them up on disconnect and guard delayed callbacks against stale connections.
Test repeated connection and disconnection without duplicate effects or lost
user data.

## Attributes and Properties

### ✅ Property/Attribute Reflection

Properties and attributes are kept in sync:

```javascript
get exampleAttribute() {
  return this.getAttribute('example-attribute');
}

set exampleAttribute(value) {
  if (value === null || value === undefined) {
    this.removeAttribute('example-attribute');
  } else {
    this.setAttribute('example-attribute', value);
  }
}
```

**Why?** Users can interact with your element either declaratively (HTML attributes) or imperatively (JavaScript properties). Keeping them in sync prevents confusion and bugs.

### ✅ Avoid Reentrancy in `attributeChangedCallback`

The `attributeChangedCallback` only handles side effects, not the full state update:

```javascript
attributeChangedCallback(name, oldValue, newValue) {
  if (oldValue === newValue) return;

  switch (name) {
    case 'example-attribute':
      // Only handle side effects here
      // The property getter reads from the attribute
      break;
  }
}
```

**Why?** If `attributeChangedCallback` also sets the property, and the property setter reflects to the attribute, you create an infinite loop. Instead, let the property getter read from the attribute directly.

### ✅ Lazy Property Upgrade

The `_upgradeProperty()` method handles properties set before the element was defined:

```javascript
_upgradeProperty(prop) {
  if (Object.prototype.hasOwnProperty.call(this, prop)) {
    const value = this[prop];
    delete this[prop];
    this[prop] = value;
  }
}
```

Called in `connectedCallback()`:

```javascript
connectedCallback() {
  this._upgradeProperty('exampleAttribute');
  // ...
}
```

**Why?** Frameworks may set properties on your element before its definition loads. This pattern preserves those early-set values.

### ✅ Don't Override Global Attributes

Always check if global attributes are already set before applying defaults:

```javascript
connectedCallback() {
  if (!this.hasAttribute('role')) {
    // Only set if not already defined
    // this.setAttribute('role', 'group');
  }
  if (!this.hasAttribute('tabindex')) {
    // this.setAttribute('tabindex', 0);
  }
}
```

**Why?** Developers using your element may need to override `role`, `tabindex`, etc. for accessibility. Always respect their choices.

## Events

### ✅ Dispatch Events for Internal State Changes

Dispatch events when your component's state changes internally:

```javascript
// Dispatch when component changes its own state
this.dispatchEvent(
  new CustomEvent('component-name:change', {
    detail: { value: newValue },
    bubbles: true,
    composed: true,
  }),
);
```

### ❌ Don't Dispatch Events for Host-Set Properties

**Don't** dispatch events when the host sets a property:

```javascript
// ❌ BAD - creates infinite loops
set myProperty(value) {
  this.setAttribute('my-property', value);
  this.dispatchEvent(new CustomEvent('change')); // DON'T DO THIS
}
```

**Why?** The host already knows it set the property. Dispatching an event can cause infinite loops with data binding systems.

## Rich Data (Objects/Arrays)

### ✅ Accept Rich Data as Properties Only

```javascript
// ✅ Good - rich data as property
set items(value) {
  this._items = value;
  this.render();
}

// ❌ Bad - trying to accept objects as attributes
set items(value) {
  this.setAttribute('items', JSON.stringify(value)); // Don't do this
}
```

**Why?** Serializing objects to strings is expensive and loses references. HTML attributes work best for primitive values.

## Implementation Notes

### Template Placeholders

This is a template repository. Before use:

1. Run `npm run setup` to replace placeholders
2. Or manually replace:
   - `COMPONENT-NAME` → your element name (e.g., `my-button`)
   - `ComponentNameElement` → your class name (e.g., `MyButtonElement`)
   - `COMPONENT_DESCRIPTION` → your description

### Testing

The test file demonstrates all the best practices:

- Authored content and entered-value preservation
- Authored global attribute preservation
- Property/attribute reflection
- Property assignment before definition, without a shadowing own property

Browser tests also check form participation, accessible labels, focus during
upgrade, hiding, reconnection, and the no-JavaScript fallback. DOM emulators
cannot establish those browser guarantees.

Run tests with:

```bash
npm test          # Watch mode
npm run test:run  # Single run
```

## Further Reading

- [Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices) - Google Web Fundamentals
- [Custom Elements Everywhere](https://custom-elements-everywhere.com/) - Framework compatibility
- [Open Web Components](https://open-wc.org/) - Tools and recommendations

## License

MIT - See [LICENSE](LICENSE)
