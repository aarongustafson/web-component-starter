# Web Component Starter - Setup Instructions

This template provides a complete setup for creating a new web component. Follow these steps to get started:

## 1. Replace Placeholders

Search and replace the following placeholders throughout the project:

- `COMPONENT-NAME` - Replace with your component's tag name (e.g., `my-awesome-component`)
- `ComponentNameElement` - Replace with your component's class name in PascalCase (e.g., `MyAwesomeComponentElement`)
- `COMPONENT_DESCRIPTION` - Replace with a description of your component

Files to update:

- `package.json`
- `README.tpl` (this will become README.md after setup)
- `COMPONENT-NAME.js` (rename this file to match your component name)
- `COMPONENT-NAME.d.ts` (rename this file to match your component name)
- `index.js`
- `define.js`
- `custom-elements.json`
- `WEB-COMPONENTS-BEST-PRACTICES.md`
- `test/setup.js`
- `test/COMPONENT-NAME.test.js` (rename this file)
- `test/browser/component.spec.js`
- `demo/index.html`
- `demo/esm.html`
- `demo/unpkg.html`
- `.github/workflows/pages.yml`

## 2. Rename Files

Rename the following files to match your component name:

```bash
mv COMPONENT-NAME.js your-component-name.js
mv COMPONENT-NAME.d.ts your-component-name.d.ts
mv test/COMPONENT-NAME.test.js test/your-component-name.test.js
```

## 3. Install Dependencies

```bash
npm install
```

## 4. Implement Your Component

Edit `your-component-name.js` to implement your web component's functionality. The template provides:

- Light-DOM initialization that preserves authored children
- Attribute observation
- Event dispatching patterns
- Property upgrade for values assigned before definition

Start with native HTML that works without JavaScript. Add shadow DOM only after
agreeing on why encapsulation is needed and documenting its styling, form, and
accessibility effects.

## 5. Write Tests

Add tests to `test/your-component-name.test.js`. The template includes:

- Vitest configuration
- Happy DOM for browser-like testing
- Testing Library utilities
- Basic test structure

## 6. Update Documentation

- The README.md will be generated from README.tpl during setup
- Keep the five README badges in template order: npm version, CI status,
  minified + gzipped size, license, and type definitions. Use the actual package
  and repository names, target the default branch’s CI workflow, and link the
  types badge to the bundled declaration file. The size estimate includes
  runtime dependencies; don’t exclude them with `externals`. Package badges
  need an npm publication, and CI needs a workflow run. Don’t substitute static
  success values for unavailable results.
- Update the generated README.md with your component's API documentation
- Update `custom-elements.json` with accurate metadata
- Create examples in `demo/index.html`
- In every displayed code example, wrap each escaped component opening and
  closing tag in its own inline `<mark>`. Mark component-specific API,
  import, and registration snippets too, including the CDN examples. Leave
  native HTML unmarked, don’t nest marks, and keep the code’s `textContent`
  unchanged. Use the shared `Mark`/`MarkText` styling rather than custom colors.
  The single highlighting unit test derives the tag from your package name and
  checks every demo HTML file; changing examples doesn’t require test snapshots
  or browser checks.
- Keep each displayed `pre/code` inside a `micro-lighter.code-panel`, with a
  language, `controls="copy"`, and a named, keyboard-focusable `pre`. Retain
  `demo/styles.css` for component-specific styles and `demo/demo-shell.css` for
  the shared responsive layout. Keep the skip link and shared author footer.
  Use the local `system-monospace` font alias, with `monospace` as its fallback,
  for demo headings and code; its font-face definition lives in `demo/styles.css`.
  Load `demo/code-examples.js` separately from the component module. It loads
  pinned MicroLighter 2.2.0 from jsDelivr, checks browser support, and loads the
  required grammars before converting marked snippets to plain text.
  If those steps fail, the authored marks remain and a visible status explains
  the failure. The optional theme loads without blocking the local demo;
  component loading stays independent. A theme-only failure gets its own status
  once highlighting and Copy are available. Keep nested theme scopes aligned with
  the page’s color scheme and increased-contrast colors. Paint the field
  background once on every MicroLighter host, even without the `code-panel` class;
  keep nested snippets, Copy buttons, and
  line-number backgrounds transparent so translucent system colors do not stack.
  Keep the pinned
  `microlighter` development dependency for the offline browser integration test,
  which checks each demo page’s languages, complete keyboard Copy, partial-load
  failures, and contrast.

## 7. Development Commands

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Install browser engines and check demo colors, focus, and layout
npx playwright install chromium firefox webkit
npm run test:browser

# Lint code
npm run lint

# Format code
npm run format
```

## 8. Clean Up Template Files

Remove the one-time setup command and delete these template-specific files:

```bash
npm pkg delete scripts.setup
rm AGENTS.md
rm SETUP.md
rm README.tpl
rm test/setup-guide.test.js
rm -rf scripts/
```

These files are only for template setup and shouldn't be in your component repository.

## 9. Before Publishing

1. Update the version in `package.json`
2. Ensure all tests pass: `npm run test:run`
3. Ensure code is formatted: `npm run format`
4. Ensure code passes linting: `npm run lint`
5. Test the demo locally
6. Update `custom-elements.json` if needed

## 10. Publishing to npm

```bash
npm publish
```

## Project Structure (After Cleanup)

```
.
├── COMPONENT-NAME.js          # Main component implementation
├── index.js                  # Main entry point (class-only export)
├── define.js                  # Auto-define script
├── custom-elements.json       # Custom Elements Manifest
├── package.json               # Package configuration
├── README.md                  # Documentation
├── LICENSE                    # MIT License
├── .gitignore                 # Git ignore rules
├── .npmignore                 # npm ignore rules
├── .prettierrc                # Prettier configuration
├── eslint.config.js           # ESLint configuration
├── vitest.config.js           # Vitest configuration
├── test/
│   ├── setup.js              # Test setup
│   ├── COMPONENT-NAME.test.js # Component tests
│   └── browser/              # Portable demo-color browser tests
└── demo/
    └── index.html            # Demo page
```

## Tips

- Keep your component focused on a single responsibility
- Use semantic HTML where possible
- Provide good accessibility (ARIA attributes, keyboard navigation)
- Document all public APIs, attributes, events, and CSS custom properties
- Write comprehensive tests
- Include examples in the demo
- Follow web component best practices
