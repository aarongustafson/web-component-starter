# Agent Instructions

This repository is a template for creating a new web component project.

## Purpose

Follow the setup process in `scripts/setup.js` and `SETUP.md` when preparing a generated repository. The setup process should:

1. Replace `COMPONENT-NAME` with the actual component name everywhere it appears.
2. Replace `ComponentNameElement` with the generated PascalCase class name.
3. Replace `COMPONENT_DESCRIPTION` with the component description.
4. Rename template files to match the chosen component name.
5. Remove template-only files from the generated repository.

## Setup Files

Template-only files that should not remain in the final repository include:

- `AGENTS.md`
- `SETUP.md`
- `README.tpl`
- `scripts/setup.js`

## What to Update

When changing the setup process, keep the script, setup instructions, and placeholder files in sync. The setup process should cover the source, tests, demo pages, package metadata, and GitHub workflow files that still contain template placeholders.

## Validation

After changing the setup workflow, run the repository checks that apply to the edited files. `npm run lint` is the minimum validation for setup-script changes.

## Notes for Agents

- Treat this repository as a template, not a finished component package.
- Keep changes minimal and focused on template generation behavior.
- If you add a new template-only file, update the cleanup list in the setup script too.