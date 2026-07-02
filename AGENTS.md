# AGENTS.md

## Project

TripKin is a mobile H5 travel companion product moving toward a launchable MVP. The project is currently in the **MVP closure foundation phase**: keep the existing mobile H5 experience demonstrable, but prioritize user behavior, data continuity, and Profile asset accumulation over page-only presentation.

The frontend is built with React, Vite, TypeScript, React Router, Less, CSS Modules, Zustand, and antd-mobile. The repository also has a TypeScript Express backend under `server/`, which is the MVP API prototype and currently uses staged in-memory/data-source implementations.

## Read First

Before editing code, read:

- `README.md`
- `docs/coding-guide.md`
- `docs/collaboration-guide.md`

If the user explicitly asks for testing, `webapp-testing`, Playwright, automated verification, screenshot verification, or repeatable browser checks, also read:

- `docs/webapp-testing-guide.md`

## Local Context

If `.local-docs/rules.md` exists, you may read it as workspace-local context for the current task.

`.local-docs/rules.md` is not a formal team rule and should not be copied directly into repository docs. It cannot override `AGENTS.md` or the confirmed docs under `docs/`.

If `.local-docs/` contains reference images, ask how they should be used before implementing against them:

- strict recreation
- style reference
- specific-part reference

## Current Scope

The current version should advance product closure in controlled stages:

1. **Stage 1: frontend closure** - use Zustand/local storage and local staged data sources to connect user assets across Home, Map, Bottle, Match, and Profile.
2. **Stage 2: backend closure** - move user assets and user actions into `server/` API endpoints, keeping frontend access behind `src/services`.
3. **Stage 3: AI closure** - introduce structured AI travel cards that can be saved, used to throw bottles, used to find companions, and accumulated in Profile.

Capabilities that are not in the active stage must not be added casually. Do not add these unless the task explicitly opens that stage or asks for that capability:

- database
- full login system
- real AI API
- new UI component library
- complex CI
- test framework

Do not add uncertain product ideas, future plans, or unconfirmed technical choices to repository docs. If a feature is only a staged placeholder, say which store/service/API it will later write to instead of presenting it as complete.

## Behavior Closure Rules

User-visible success must correspond to a trackable result. For user actions such as submit, save, collect, like, follow, apply, invite, or edit profile:

- Prefer writing through `src/services` or a shared `src/store` module before showing a success Toast.
- If the stage does not yet implement the write path, the UI copy and documentation must say it is a staged placeholder.
- Do not add page-local fake success for behavior that Profile or another page is expected to read later.
- Profile-facing assets should be modeled as user assets before adding new isolated mock lists.

## Webapp Testing

Do not use `webapp-testing` by default.

Use it only when the user explicitly asks for testing, `webapp-testing`, Playwright, automated verification, screenshot verification, or repeatable browser checks.

Before using it, read `docs/webapp-testing-guide.md`.

Do not copy a local AI skill directory into this repository. If `webapp-testing` is unavailable in the current AI environment, explain that and guide the user to install or enable it in their own AI tool environment.

All temporary Playwright scripts, screenshots, traces, logs, and browser artifacts must stay under ignored `.venv/` paths.

## Code Placement Rules

- Routed pages go in `src/pages`.
- Page-internal feature blocks go in `src/modules`.
- Cross-page reusable UI goes in `src/components`.
- Request and data-access code goes in `src/services`.
- Shared Zustand state goes in `src/store`.
- Pure helpers go in `src/utils`.
- Minimal backend code goes in `server`.

Keep ordinary page-local code close to the page until reuse is clear.

Prefer confirmed shared styles and shared components when they already exist.

Do not create shared components for speculative reuse. Do not modify confirmed shared components or global styles for a page-local need unless explicitly requested.

## Mobile Layout Rules

The layout baseline is 375px width.

Do not create fixed 375px page canvases. Use fluid width, `min-height: 100svh`, and natural vertical scrolling.

The app is mobile-first. Keep page content usable at 375px width and avoid horizontal overflow.

Do not introduce rem/vw scaling systems, Tailwind, or mobile adaptation libraries unless explicitly requested.

## Documentation Sync

When changing project structure, scripts, routes, global styles, engineering workflow, or shared components, update the related documentation in the same change.

When shared component or global style changes affect collaboration, update `docs/decision-notes/README.md`.

Use these sources:

- `README.md`: quick start, confirmed scripts, confirmed routes, document index
- `docs/coding-guide.md`: code placement, naming, style rules
- `docs/collaboration-guide.md`: collaboration and commit workflow
- `docs/decision-notes/README.md`: decisions that affect multiple people

Do not write decision notes for ordinary page-local changes.

## Commit Message Rules

Use only these formats:

- `type: subject`
- `type(scope): subject`

Do not use empty scope parentheses.

Bad:

```txt
feat(): subject
```

Allowed types are defined in `commitlint.config.cjs`.

## Verification

Before claiming completion for changes that include source code, styles, routes, scripts, dependencies, engineering configuration, backend code, or behavior that affects the running app, run:

```bash
npm run lint
npm run build
```

For documentation-only changes, such as Markdown explanations, collaboration notes, requirement整理, or decision records, these commands are not required as long as the change does not alter code, configuration, scripts, executable commands, or runtime behavior.

If documentation formatting changed and formatting verification is relevant to the task, optionally run:

```bash
npm run format:check
```
