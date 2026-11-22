# Web Component Starter Template

[![CI status](https://img.shields.io/github/actions/workflow/status/aarongustafson/web-component-starter/ci.yml?branch=main&label=CI)](https://github.com/aarongustafson/web-component-starter/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/aarongustafson/web-component-starter)](https://github.com/aarongustafson/web-component-starter/blob/main/LICENSE)

A starter template for building light-DOM web components with tests, demos, and npm publishing workflows. The example component preserves authored HTML; you add its enhancement and document its behavior. The template draws on [Google’s Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices) and my web components work.

<a id="-features"></a>
<a id="-use-cases"></a>

## Features

- **Tooling**: Vitest, ESLint, Prettier, and Happy DOM
- **Progressive enhancement**: Light DOM by default, preserving authored content, native forms, and document styles
- **Import options**: Class-only imports and a guarded registration module
- **Testing**: Unit and browser tests, with coverage reporting
- **GitHub Actions**: Checks, demo deployment, and npm publishing workflows
- **Setup**: An interactive script that names the component and generates its README

<a id="-quick-start"></a>

## Quick Start

### Use This Template

1. Click “Use this template” on GitHub to create your repository, then clone it. You can also clone the starter directly:

```bash
git clone https://github.com/aarongustafson/web-component-starter.git my-component
cd my-component
```

2. Run the interactive setup:

```bash
npm install
npm run setup
```

The setup script will:

- Ask for your component name (e.g., `my-awesome-component`)
- Ask for a description
- Rename the component, declaration, and component test files
- Replace the name, class, and description placeholders in the listed source and configuration files
- Generate your component’s README from `README.tpl`
- Remove the one-time setup command, `SETUP.md`, `README.tpl`, `scripts/setup.js`, and `test/setup-guide.test.js`
- Install dependencies
- Initialize Git and make an initial commit only if there’s no `.git` directory

Setup retains `AGENTS.md`, the demo editing guide, shared demo files and checks,
and versioning helpers. Review the generated files, implement your component,
and replace the example documentation with its actual behavior. Setup doesn’t
create a GitHub repository or change an existing Git remote.

### Manual Setup

See [SETUP.md](SETUP.md) for the placeholder and file map used by initialization.
Use `npm run setup` to keep the generated files and retained automation aligned.

### README badges

Generated component READMEs start with five Shields.io badges, in this order:
npm version, CI status, minified + gzipped size, license, and type definitions.
Setup replaces the component name in their package, repository, and declaration
links. The badge test checks the template before setup and the generated README
afterward.

The size badge estimates the published package’s minified, gzipped bundle,
including its runtime dependencies. It isn’t a package-archive or page-transfer
size. Package badges may be unavailable before the first npm publication; CI
needs a workflow run. Don’t replace unavailable results with static success badges.

This starter isn’t a published component package, so its own README shows only
repository CI and license badges.

<a id="-whats-included"></a>

## What’s Included

```
web-component-starter/
├── COMPONENT-NAME.js                    # Component implementation
├── COMPONENT-NAME.d.ts                  # TypeScript declarations
├── index.js                             # Main entry (class-only export)
├── define.js                            # Auto-define only
├── custom-elements.json                 # Custom Elements Manifest
├── package.json                         # Package config with scripts
├── LICENSE                              # MIT License
├── README.md                            # This file (replaced after setup)
├── README.tpl                           # Template for your component's README
├── WEB-COMPONENTS-BEST-PRACTICES.md       # Best practices documentation
├── AGENTS.md                            # Retained contributor instructions
├── .gitignore                           # Git ignore
├── .npmignore                           # npm ignore
├── .prettierrc                          # Prettier config
├── .editorconfig                        # Editor config
├── eslint.config.js                     # ESLint config
├── vitest.config.js                     # Vitest config
├── .github/
│   ├── workflows/
│   │   ├── ci.yml                      # Continuous integration
│   │   ├── pages.yml                   # Demo deployment
│   │   └── publish.yml                 # Auto-publish to npm
│   └── ISSUE_TEMPLATE/                 # Bug & feature templates
├── scripts/
│   ├── setup.js                        # Interactive setup script (removed after setup)
│   ├── check-demo-shared.js            # Retained shared-file integrity check
│   └── update-demo-versions.js          # Retained version helper
├── test/
│   ├── setup.js                        # Test configuration
│   └── COMPONENT-NAME.test.js          # Test suite
├── demo/
│   ├── index.html                      # Local component examples
│   ├── esm.html                        # Versioned esm.sh example
│   ├── unpkg.html                      # Latest-version unpkg example
│   ├── README.md                       # Retained demo editing guide
│   ├── demo-shell.css                  # Shared layout and colors
│   └── styles.css                      # Component-owned example styles
├── SETUP.md                            # Manual setup guide (removed after setup)
└── CONTRIBUTING.md                     # Contribution guidelines
```

<a id="-development"></a>

## Development

### Available Scripts

```bash
npm run setup          # One-time interactive initialization
npm test               # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ui        # Open Vitest UI
npm run test:coverage  # Generate coverage report
npm run test:browser   # Check demo colors, keyboard focus, and layout in browsers
npm run demo:check     # Check managed demo files against their integrity snapshot
npm run lint           # Check demo integrity, ESLint, and Prettier
npm run format         # Apply ESLint fixes and Prettier formatting
```

Install Playwright’s browser engines before running browser tests:

```bash
npx playwright install chromium firefox webkit
```

For demo structure, shared-file ownership, and validation, see
[the demo editing guide](demo/README.md). Format only the files you intend to
change when working on a scoped edit; `npm run format` covers the repository.

### Component Architecture

The starter leaves authored children in light DOM. It doesn’t create a shadow
root, replace content, or add roles, tab stops, or styles. Native content remains
available before registration and if JavaScript fails. `render()` is an
initialization hook; it currently only records that initialization completed.
Property upgrade happens synchronously on connection, including when a property
was assigned before the element was defined.

Choose shadow DOM only when a component needs an explicit encapsulation boundary.
Document that decision and its effects on styling, forms, and accessibility
before adding it. See [the best-practices guide](./WEB-COMPONENTS-BEST-PRACTICES.md).

The package root and component module export the class without registering it.
Import `define.js` to register automatically, or call its helper explicitly.
The default tag is lowercased so the unconfigured starter demo works too.

**Option 1: Manual registration**

```javascript
import { ComponentNameElement } from '@yourscope/component-name/COMPONENT-NAME.js';

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

<a id="-testing"></a>

## Testing

Includes:

- **Vitest**: Unit test runner
- **Happy DOM**: DOM environment for unit tests
- **Testing Library**: DOM testing utilities
- **Coverage**: V8 coverage reporting
- **UI**: Interactive test debugging

The component tests cover pre-definition properties and preservation of authored
content through rendering and reconnection. Browser tests verify native form
participation, labels, focus during upgrade, `hidden`, and the no-JavaScript
fallback in Chromium, Firefox, and WebKit. These checks don’t replace a component’s
own keyboard and assistive-technology review.

The demo-highlighting test reports the number of HTML pages and displayed
component tags checked. It fails if either count is zero or a component tag
appears outside a `mark`.

The demo tests also cover code/live layout, keyboard Copy controls, optional
highlighting failures, and color contrast. They serve the pinned MicroLighter
dependency locally, so these checks don’t verify CDN availability. Keep shared
layout and enhancement changes separate from local examples, as described in
[the demo editing guide](demo/README.md).

Use the verbose reporter to show the evidence counts for a successful run:

```bash
npm run test:run -- test/demo-mark.test.js --reporter=verbose
```

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

<a id="-publishing"></a>

## Publishing

<a id="setup-automated-publishing-with-oidc-recommended"></a>

### Set Up Automated Publishing with OIDC

The publishing workflow uses [npm trusted publishing](https://docs.npmjs.com/trusted-publishers/) with OpenID Connect (OIDC), so it doesn’t need a long-lived npm token.

**Initial Setup:**

1. Publish your package to npm manually the first time:

   ```bash
   npm run test:run  # Ensure tests pass
   npm run lint      # Ensure code is clean
   npm publish       # First publish must be manual
   ```

2. Configure a trusted publisher on npm:
   - Visit your package's access page: `https://www.npmjs.com/package/@yourscope/your-component-name/access`
   - Find the trusted publisher settings
   - Add GitHub Actions as a trusted publisher with these settings:
     - **Provider**: GitHub
     - **Organization/Username**: Your GitHub username or organization
     - **Repository**: Your repository name
     - **Workflow filename**: `publish.yml` (stored in `.github/workflows/`)
     - **Environment**: Leave blank (unless you use GitHub environments)

3. When you’re ready to publish, run `npm version patch` (or `minor`/`major`) from a clean working tree. npm updates the package version, runs the `version` script, and creates a commit and version tag. The script updates both esm.sh URLs in `demo/esm.html` and stages that file. The `postversion` script runs `git push --follow-tags`, pushing the commit and tag.

The workflow runs on a pushed `v*` tag, not on a GitHub release. It verifies that
the tag matches `package.json`, runs lint and unit tests, then publishes with
provenance. It also supports a manual workflow run: `dry-run` is the default;
select `publish` only when you intend to publish. If the automatic push fails,
inspect the local commit and tag before retrying `git push --follow-tags`.

### Manual Publishing

If you prefer to publish manually without automation:

```bash
npm run test:run  # Ensure tests pass
npm run lint      # Ensure code is clean
npm publish       # Publish to npm
```

<a id="-browser-support"></a>

## Browser Support

The starter uses:

- Custom Elements v1
- ES Modules

The browser suite runs in Chromium, Firefox, and WebKit. Test any additional
platform APIs your component uses; these tests don’t establish support in every
browser version. Authored native HTML remains available if registration fails.

<a id="-documentation"></a>

## Documentation

- [WEB-COMPONENTS-BEST-PRACTICES.md](WEB-COMPONENTS-BEST-PRACTICES.md) - Explanation of best practices used in this template
- [SETUP.md](SETUP.md) - Detailed setup instructions (removed after setup)
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines
- [demo/README.md](demo/README.md) - Demo editing, ownership, and validation
- [LICENSE](LICENSE) - MIT License

<a id="-credits"></a>

## Credits

Based on best practices from:

- [Google’s Custom Element Best Practices](https://web.dev/articles/custom-elements-best-practices)
- [form-obfuscator](https://github.com/aarongustafson/form-obfuscator) by Aaron Gustafson
- [Open Web Components](https://open-wc.org/)

<a id="-license"></a>

## License

MIT - See [LICENSE](LICENSE)

<a id="-contributing"></a>

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidance.
