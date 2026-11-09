# Web Component Starter Template

A comprehensive, production-ready starter template for creating Web Components. This template is based on the architecture and best practices from my web components work, incorporating [Google's Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices).

## ✨ Features

- **Modern Tooling**: Vitest, ESLint, Prettier, Happy DOM
- **Best Practices**: Shadow DOM, Custom Elements v1, proper encapsulation, following [Google's recommendations](https://web.dev/articles/custom-elements-best-practices)
- **Multiple Import Options**: Auto-define, manual definition, or both
- **Testing**: Comprehensive test setup with coverage reporting
- **CI/CD**: GitHub Actions workflows included
- **Developer Experience**: Demo page, interactive setup, extensive documentation
- **Publishing Ready**: npm package configuration and automated publishing workflow

## 🚀 Quick Start

### Use This Template

1. Click "Use this template" on GitHub, or:

```bash
git clone https://github.com/aarongustafson/web-component-starter.git my-component
cd my-component
```

2. Run the interactive setup:

```bash
npm install
npm run setup
```

The setup wizard will:

- Ask for your component name (e.g., `my-awesome-component`)
- Ask for a description
- Rename all files automatically
- Replace all placeholders in code and configuration
- **Generate your component's README from template**
- **Clean up template setup files** (SETUP.md, README.tpl, scripts/)
- Install dependencies
- Initialize git repository

### Manual Setup

If you prefer manual setup, see [SETUP.md](SETUP.md) for detailed instructions.

## 📁 What's Included

```
web-component-starter/
├── COMPONENT-NAME.js                    # Component implementation
├── index.js                             # Main entry (class + auto-define)
├── define.js                            # Auto-define only
├── custom-elements.json                 # Custom Elements Manifest
├── package.json                         # Package config with scripts
├── LICENSE                              # MIT License
├── README.md                            # This file (replaced after setup)
├── README.tpl                           # Template for your component's README
├── WEB-COMPONENTS-BEST-PRACTICES.md    # Best practices documentation
├── .gitignore                           # Git ignore
├── .npmignore                           # npm ignore
├── .prettierrc                          # Prettier config
├── .editorconfig                        # Editor config
├── eslint.config.js                     # ESLint config
├── vitest.config.js                     # Vitest config
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                      # Continuous integration
│   │   └── publish.yml                 # Auto-publish to npm
│   └── ISSUE_TEMPLATE/                 # Bug & feature templates
├── scripts/
│   └── setup.js                        # Interactive setup wizard (removed after setup)
├── test/
│   ├── setup.js                        # Test configuration
│   └── COMPONENT-NAME.test.js          # Test suite
├── demo/
│   └── index.html                      # Live demo page
├── SETUP.md                            # Manual setup guide (removed after setup)
└── CONTRIBUTING.md                     # Contribution guidelines
```

## 🛠️ Development

### Available Scripts

```bash
npm run setup          # Interactive setup wizard
npm test               # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ui        # Open Vitest UI
npm run test:coverage  # Generate coverage report
npm run test:browser   # Check demo colors, keyboard focus, and layout in browsers
npm run lint           # Lint with ESLint + Prettier
npm run format         # Auto-fix linting issues
```

### Demo colors

The shared demo stylesheet pairs reading surfaces and styled buttons with
`CanvasText` on `Canvas`, and fields with `FieldText` on `Field`.
Marked code retains `MarkText` on `Mark`. Focus outlines use `CanvasText` against
the surrounding Canvas surface.

The initial study's button pair passed its recorded observations, but the added
Ubuntu WebKit dark check exposed white `ButtonText` on a light `ButtonFace` at
1.82:1. The starter therefore uses its reading pair for inline code and styled
buttons instead. Native button semantics and keyboard behavior remain intact.

Footer text and direct `small` children of Canvas-based demo containers use
`color-mix(in srgb, CanvasText 80%, Canvas)`. This opaque 80:20 mix passed normal
text AA in all 62 scheme observations from the November 2026 system-color study;
the lowest calculated ratio was 5.78:1. That result does not establish contrast
for every user palette or authored theme.

Other `small` text inherits its surface's full-strength foreground. Applying
the same 80% treatment to button or field text failed in some study observations.
Unsupported `color-mix`, increased-contrast preferences, and forced colors use
full-strength supporting text. Automatic forced-color adjustment stays enabled.

Keep foregrounds and backgrounds paired when customizing the demo. If you
change a Canvas container's palette or nest supporting text on a different
surface, update its text treatment and verify the actual contrast. Do not apply
the muted color to links or required control graphics.

Run the portable browser regressions after changing demo styles:

```sh
npx playwright install chromium firefox webkit
npm run test:browser
```

The tests paint the 19 distinct relevant palettes from the study's 62 observations
through the actual stylesheet, preserving alpha. They also check native
light/dark rendering, keyboard focus, fallback colors, increased contrast,
Chromium forced-color emulation, and narrow-screen layout. They do not replace
testing actual Windows Contrast themes, Firefox preferences, or mobile devices.

### Component Architecture

This template provides flexible import options:

**Option 1: Manual registration**

```javascript
import { ComponentNameElement } from '@yourscope/component-name';

customElements.define('my-custom-name', ComponentNameElement);
```

**Option 2: Guarded auto-define (browser environments only)**

```javascript
import '@yourscope/component-name/define.js';
// Registers the element when customElements is available
```

Prefer to control when registration happens? Call the helper directly:

```javascript
import { defineComponentName } from '@yourscope/component-name/define.js';

defineComponentName();
```

## 🧪 Testing

Includes:

- **Vitest**: Fast, modern test runner
- **Happy DOM**: Lightweight browser environment
- **Testing Library**: DOM testing utilities
- **Coverage**: V8 coverage reporting
- **UI**: Interactive test debugging

Example:

```javascript
import { describe, it, expect } from 'vitest';

describe('MyComponent', () => {
  it('should render', () => {
    const el = document.createElement('my-component');
    expect(el).toBeInstanceOf(HTMLElement);
  });
});
```

## 📦 Publishing

### Setup Automated Publishing with OIDC (Recommended)

This template is configured to publish to npm using OpenID Connect (OIDC), which is more secure than using long-lived NPM tokens.

**Initial Setup:**

1. Publish your package to npm manually the first time:

   ```bash
   npm run test:run  # Ensure tests pass
   npm run lint      # Ensure code is clean
   npm publish       # First publish must be manual
   ```

2. Configure OIDC on npm:
   - Visit your package's access page: `https://www.npmjs.com/package/@yourscope/your-component-name/access`
   - Under "Publishing Access", click "Configure OIDC"
   - Add GitHub Actions as a trusted publisher with these settings:
     - **Provider**: GitHub
     - **Organization/Username**: Your GitHub username or organization
     - **Repository**: Your repository name
     - **Workflow**: `.github/workflows/publish.yml`
     - **Environment**: Leave blank (unless you use GitHub environments)

3. Create a GitHub release to trigger automated publishing:
   - Use `npm version` to update version and create a tag: `npm version patch` (or `minor`/`major`)
   - Push with tags: `git push --follow-tags`
   - Or create a release through GitHub's UI

The GitHub Actions workflow (`.github/workflows/publish.yml`) will automatically publish to npm when you create a new version tag.

### Manual Publishing

If you prefer to publish manually without automation:

```bash
npm run test:run  # Ensure tests pass
npm run lint      # Ensure code is clean
npm publish       # Publish to npm
```

## 🌐 Browser Support

Works in all modern browsers supporting:

- Custom Elements v1
- Shadow DOM v1
- ES Modules

For legacy browsers, use polyfills.

## 📚 Documentation

- [WEB-COMPONENTS-BEST-PRACTICES.md](WEB-COMPONENTS-BEST-PRACTICES.md) - Explanation of best practices used in this template
- [SETUP.md](SETUP.md) - Detailed setup instructions (removed after setup)
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [LICENSE](LICENSE) - MIT License

## 🎯 Use Cases

Perfect for:

- Reusable UI components
- Design system elements
- Form controls and widgets
- Interactive content blocks
- Accessibility-enhanced components

## 🙏 Credits

Based on best practices from:

- [Google's Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices)
- [form-obfuscator](https://github.com/aarongustafson/form-obfuscator) by Aaron Gustafson
- [Open Web Components](https://open-wc.org/)

## 📄 License

MIT - See [LICENSE](LICENSE)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Ready to build your web component?** Run `npm run setup` to get started! 🚀
