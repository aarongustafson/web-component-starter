# Web Component Starter Template

A comprehensive, production-ready starter template for creating Web Components. This template is based on the architecture and best practices from [form-obfuscator](https://github.com/aarongustafson/form-obfuscator).

## ✨ Features

- **Modern Tooling**: Vitest, ESLint, Prettier, Happy DOM
- **Best Practices**: Shadow DOM, Custom Elements v1, proper encapsulation
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
- Replace all placeholders
- **Clean up template setup files** (SETUP.md, scripts/)
- Install dependencies
- Initialize git repository

### Manual Setup

If you prefer manual setup, see [SETUP.md](SETUP.md) for detailed instructions.

## 📁 What's Included

```
web-component-starter/
├── COMPONENT-NAME.js          # Component implementation
├── index.js                   # Main entry (class + auto-define)
├── define.js                  # Auto-define only
├── custom-elements.json       # Custom Elements Manifest
├── package.json               # Package config with scripts
├── LICENSE                    # MIT License
├── .gitignore                 # Git ignore
├── .npmignore                 # npm ignore
├── .prettierrc                # Prettier config
├── .editorconfig              # Editor config
├── eslint.config.js           # ESLint config
├── vitest.config.js           # Vitest config
├── .github/
│   ├── workflows/
│   │   ├── ci.yml            # Continuous integration
│   │   └── publish.yml       # Auto-publish to npm
│   └── ISSUE_TEMPLATE/       # Bug & feature templates
├── scripts/
│   └── setup.js              # Interactive setup wizard (removed after setup)
├── test/
│   ├── setup.js              # Test configuration
│   └── COMPONENT-NAME.test.js # Test suite
├── demo/
│   └── index.html            # Live demo page
├── SETUP.md                  # Manual setup guide
└── CONTRIBUTING.md           # Contribution guidelines
```

## 🛠️ Development

### Available Scripts

```bash
npm run setup          # Interactive setup wizard
npm test               # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ui        # Open Vitest UI
npm run test:coverage  # Generate coverage report
npm run lint           # Lint with ESLint + Prettier
npm run format         # Auto-fix linting issues
```

### Component Architecture

This template provides three flexible import options:

**Option 1: Auto-define (easiest)**
```javascript
import '@yourscope/component-name';
// Element is automatically registered
```

**Option 2: Manual registration**
```javascript
import { ComponentNameElement } from '@yourscope/component-name/component-name.js';
customElements.define('my-custom-name', ComponentNameElement);
```

**Option 3: Both**
```javascript
import { ComponentNameElement } from '@yourscope/component-name';
// Element is registered AND class is available for extension
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

### Setup npm Publishing

1. Add `NPM_TOKEN` to GitHub repository secrets
2. Update version in `package.json`
3. Create a GitHub release
4. Automated workflow publishes to npm

### Manual Publishing

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
- [form-obfuscator](https://github.com/aarongustafson/form-obfuscator) by Aaron Gustafson
- [Open Web Components](https://open-wc.org/)

## 📄 License

MIT - See [LICENSE](LICENSE)

## 🤝 Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Ready to build your web component?** Run `npm run setup` to get started! 🚀
