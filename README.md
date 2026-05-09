# @mootp/moo-ui

> Internal Angular 21 UI component library for mootp projects. Not publishing to npm yet.

[![Angular](https://img.shields.io/badge/Angular-21-red)](https://angular.dev)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-181717?logo=github)](https://pages.github.com/)

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/cubes.svg" alt="" width="16" height="16"> Overview

`@mootp/moo-ui` is an internal Angular component library built with:

- **Angular 21** – standalone components, signal-based inputs/outputs, modern control flow
- **SCSS** – scoped component styles with CSS custom-property design tokens
- **Tailwind CSS v3** – utility classes available in the demo app and consumer projects

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/table-cells-large.svg" alt="" width="16" height="16"> Component Inventory

| Component | Selector | Status |
|-----------|----------|--------|
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/rectangle-list.svg" alt="" width="14" height="14"> Button | `<moo-button>` | ✅ |
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/i-cursor.svg" alt="" width="14" height="14"> Input | `<moo-input>` | ✅ |
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/address-card.svg" alt="" width="14" height="14"> Card | `<moo-card>` | ✅ |
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/tag.svg" alt="" width="14" height="14"> Badge | `<moo-badge>` | ✅ |
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/circle-exclamation.svg" alt="" width="14" height="14"> Alert | `<moo-alert>` | ✅ |
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/spinner.svg" alt="" width="14" height="14"> Spinner | `<moo-spinner>` | ✅ |
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/user.svg" alt="" width="14" height="14"> Avatar | `<moo-avatar>` | ✅ |
| <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/window-restore.svg" alt="" width="14" height="14"> Modal | `<moo-modal>` | ✅ |

Planned next wave: Tooltip, Dropdown, Select, Table, Tabs, Accordion, Toast.

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/download.svg" alt="" width="16" height="16"> Installation

```bash
# local workspace development
npm install
```

### Current distribution mode

```bash
# build the library locally
npm run build
```

Consume the built library from `dist/moo-ui` locally or wire it into team projects later when the package strategy is finalized.

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/screwdriver-wrench.svg" alt="" width="16" height="16"> Setup

### 1. Import design tokens

Add the design-token stylesheet to your global `styles.scss`:

```scss
// Option A – import prebuilt CSS from node_modules
@import '@mootp/moo-ui/themes/default';

// Option B – copy/paste the :root block from projects/moo-ui/themes/default.css
// and override variables to theme the library
```

Or reference it in `angular.json`:

```json
"styles": ["node_modules/@mootp/moo-ui/themes/default.css", "src/styles.scss"]
```

### 2. Use components

Every component is standalone – import only what you need:

```typescript
import { ButtonComponent, SpinnerComponent } from '@mootp/moo-ui';

@Component({
  imports: [ButtonComponent, SpinnerComponent],
  template: `
    <moo-button variant="primary" (clicked)="save()">Save</moo-button>
    <moo-spinner size="sm" />
  `,
})
export class MyComponent {}
```

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/code.svg" alt="" width="16" height="16"> Component API

### Button

```html
<moo-button
  variant="primary"   <!-- primary | secondary | outline | ghost | danger -->
  size="md"           <!-- sm | md | lg -->
  [loading]="isSaving"
  [disabled]="!form.valid"
  (clicked)="onSave($event)"
>
  Save
</moo-button>
```

### Input

```html
<moo-input
  label="Email address"
  type="email"
  placeholder="you@example.com"
  [error]="emailError"
  hint="We'll never share your email."
  [(ngModel)]="email"
/>
```

Implements `ControlValueAccessor` – works with both template-driven and reactive forms.

### Card

```html
<moo-card padding="md" [shadow]="true">
  <div moo-card-header>Card Title</div>
  Main card content goes here.
  <div moo-card-footer>Footer actions</div>
</moo-card>
```

### Badge

```html
<moo-badge variant="success" size="md">Active</moo-badge>
<!-- variants: default | primary | secondary | success | warning | danger | info -->
```

### Alert

```html
<moo-alert variant="warning" title="Heads up!" [dismissible]="true" (dismissed)="onDismiss()">
  This action cannot be undone.
</moo-alert>
```

### Spinner

```html
<moo-spinner size="md" variant="primary" label="Loading data..." />
<!-- sizes: xs | sm | md | lg | xl -->
```

### Avatar

```html
<moo-avatar src="/avatar.jpg" alt="Jane Doe" size="md" shape="circle" />
<!-- Falls back to initials when src is absent or fails to load -->
<moo-avatar initials="JD" size="lg" />
```

### Modal

```html
<!-- In template -->
<moo-modal
  [open]="isOpen"
  title="Confirm Action"
  size="md"
  [closeOnBackdrop]="true"
  (closed)="isOpen = false"
>
  Are you sure you want to continue?
  <div moo-modal-footer>
    <moo-button variant="outline" (clicked)="isOpen = false">Cancel</moo-button>
    <moo-button variant="danger" (clicked)="confirm()">Delete</moo-button>
  </div>
</moo-modal>
```

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/palette.svg" alt="" width="16" height="16"> Design Tokens

All visual properties are driven by CSS custom properties defined in `themes/default.css`.
Override them in your own stylesheet to theme the library:

```css
:root {
  --moo-color-primary: #7c3aed;       /* brand colour */
  --moo-color-primary-dark: #6d28d9;
  --moo-radius-md: 0.5rem;             /* rounder corners */
  --moo-font-sans: 'Inter', sans-serif;
}
```

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/laptop-code.svg" alt="" width="16" height="16"> Development

```bash
# Install dependencies
npm install

# Build the library (output: dist/moo-ui)
npm run build

# Build the demo app
npm run build:demo

# Build the GitHub Pages artifact (output: dist/github-pages)
npm run build:pages

# Run library unit tests
npm test
```

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/rocket.svg" alt="" width="16" height="16"> Package status

`moo-ui` is **not being published to npm yet**.

The library package is currently marked as private to prevent accidental publish while the component set, docs, and distribution workflow are still evolving.

### GitHub Pages demo

The demo app is prepared for static hosting on GitHub Pages:

- `angular.json` includes a `github-pages` build configuration with `baseHref: /moo-ui/`
- `npm run build:pages` builds the demo and prepares `dist/github-pages`
- `.github/workflows/github-pages.yml` publishes the artifact from `main`
- `scripts/prepare-pages.mjs` adds `.nojekyll` and `404.html` for Pages-friendly static hosting
- Before the first successful run, enable **Settings > Pages > Source: GitHub Actions** for the repository. Without that one-time repo setting, `actions/configure-pages` returns `404 Not Found`.

If you need to publish manually:

```bash
npm install
npm run build:pages
```

Then upload the contents of `dist/github-pages` to your Pages target.

### Git / remote bootstrap

This environment could not create or push a repo directly, so run these commands locally if `moo-ui` still needs its own standalone repository:

```bash
cd C:\sourcecode\github\copilot\moo-ui
git init -b main
git add .
git commit -m "Prepare Angular demo for GitHub Pages"
git remote add origin https://github.com/<owner>/moo-ui.git
git push -u origin main
```

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/folder-tree.svg" alt="" width="16" height="16"> Workspace structure

```text
moo-ui/
├── .github/workflows/          # GitHub Pages deployment workflow
├── projects/
│   ├── moo-ui/               # Publishable library source
│   │   ├── src/
│   │   │   ├── lib/          # Components
│   │   │   └── public-api.ts # Public API barrel
│   │   ├── themes/           # Design token CSS
│   │   ├── ng-package.json
│   │   └── package.json      # Published package.json
│   └── demo/                 # Demo application
├── LOGS.md
├── angular.json
├── package.json
├── scripts/
├── tailwind.config.js
└── tsconfig.json
```

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/brands/github.svg" alt="" width="16" height="16"> Links

- <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/brands/angular.svg" alt="" width="14" height="14"> [Angular docs](https://angular.dev)
- <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/brands/github.svg" alt="" width="14" height="14"> [GitHub Pages docs](https://docs.github.com/pages)
- <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/brands/npm.svg" alt="" width="14" height="14"> [npm package](https://www.npmjs.com/package/@mootp/moo-ui)

## <img src="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.7.2/svgs/solid/scale-balanced.svg" alt="" width="16" height="16"> License

MIT © mootp
