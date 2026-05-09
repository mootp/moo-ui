# Implementation Log

## 2026-05-09

1. Reviewed the Angular workspace, library exports, README, and demo configuration inside `moo-ui`.
2. Checked for a standalone `moo-ui/.git` repository and confirmed it is missing; automatic `git init` is blocked in this environment because `pwsh.exe` is unavailable.
3. Added a GitHub Pages build flow for the Angular demo with a dedicated `build:pages` script and a small Node post-build step that prepares `dist/github-pages`, `.nojekyll`, and `404.html`.
4. Added a standalone GitHub Actions workflow in `moo-ui/.github/workflows/github-pages.yml` to build and deploy the static demo from the `main` branch.
5. Upgraded `README.md` with GitHub-friendly Font Awesome iconography, refreshed setup/publishing guidance, and documented the exact manual git/remote commands required if repo initialization or pushing cannot be done from this environment.
6. Checked workspace diagnostics after the edits; no IDE diagnostics were reported for the touched Angular workspace files.
7. Full build/test validation could not be executed from this session because the available shell tool depends on PowerShell 6+, which is not installed here.
8. Marked the library package as private and updated the README to reflect that `moo-ui` is not being published to npm yet.

## 2025-07-14

**Standalone git repo init / remote / push attempt**

- `git init`: not executed.
- Initial commit with Copilot trailer: not created.
- `origin` -> `https://github.com/mootp/moo-ui.git`: not set.
- `main` branch setup: not executed.
- Push verification: failed / not attempted.
- Exact blocker: `pwsh.exe` is not recognized as an internal or external command, so this environment cannot execute the required git commands.

[2026-05-09T00:00:00Z] Moved project directory from `C:\sourcecode\github\copilot\moo-ui` to `C:\sourcecode\github\copilot\workspaces\moo-ui`. Verified the new path exists and counted 72 child items (52 files, 20 directories).

9. Installed pwsh support, removed the old workspace path at C:\sourcecode\github\copilot\moo-ui, initialized a standalone git repository in C:\sourcecode\github\copilot\workspaces\moo-ui, and prepared the GitHub remote https://github.com/mootp/moo-ui.git.
10. Adjusted the GitHub Pages workflow documentation after the first workflow run failed at `actions/configure-pages@v5` with `404 Not Found`; the repository still needs the one-time **Settings > Pages > Source: GitHub Actions** enablement in GitHub before the workflow can succeed.
11. Updated the workspace `typescript` devDependency from `~5.7.0` to `~5.9.2` to satisfy the Angular 21 build toolchain peer dependency required by `@angular-devkit/build-angular`.
12. Fixed the demo Pages build by removing the invalid TypeScript `ignoreDeprecations` setting and loading the library design-token CSS through `angular.json` instead of a deprecated Sass `@import`.
13. Upgraded `karma-jasmine-html-reporter` to `~2.2.0`, refreshed `package-lock.json`, and kept the workspace on the current Tailwind major version.
14. Added Phase 1 Angular 21 standalone components for `Select`, `Textarea`, `Checkbox`, `Radio`, `Toggle`, `Dropdown`, `Tooltip`, and `Toast`, plus shared form-field and overlay utilities for consistent APIs and keyboard behavior.
15. Updated public exports, demo usage, and README inventory/API docs so the new components are available from the library barrel and visible in the demo experience.
16. Validated the library build with `npm run build`, the demo/pages artifact with `npm run build:pages`, and unit coverage with `npm test -- --watch=false --browsers=ChromeHeadless` (4 passing specs).
