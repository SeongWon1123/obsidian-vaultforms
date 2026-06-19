# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-19 14:30:57 +09:00
**Commit:** f8667ce
**Branch:** main

## OVERVIEW

This repository is an Obsidian community plugin scaffold named `sample-plugin`. TypeScript source in `src/` is bundled by esbuild into the root `main.js` artifact that Obsidian loads.

## STRUCTURE

```text
obsidian-vaultforms/
  src/main.ts                    # Plugin class, command/ribbon/status registration, modal
  src/settings.ts                # Settings shape, defaults, settings tab UI
  esbuild.config.mjs             # Bundles src/main.ts -> main.js
  eslint.config.mts              # ESLint flat config with obsidianmd recommended rules
  manifest.json                  # Obsidian plugin identity: id sample-plugin
  versions.json                  # Plugin version -> minAppVersion map
  version-bump.mjs               # Syncs package version into manifest and versions map
  .github/workflows/lint.yml     # Node 20/22/24 build and lint CI
  .github/workflows/release.yml  # Tag-triggered draft GitHub release
  main.js                        # Generated bundle; do not hand-edit
  styles.css                     # Optional release artifact
```

## WHERE TO LOOK

| Task | Location | Notes |
| --- | --- | --- |
| Plugin lifecycle | `src/main.ts` | `MyPlugin.onload()` loads settings, registers UI, commands, DOM events, interval |
| Commands | `src/main.ts` | Current IDs: `open-modal-simple`, `replace-selected`, `open-modal-complex` |
| Settings | `src/settings.ts` | `MyPluginSettings`, `DEFAULT_SETTINGS`, `SampleSettingTab` |
| Bundle behavior | `esbuild.config.mjs` | Externalizes Obsidian, Electron, CodeMirror, Lezer, and Node builtins |
| Type checks | `tsconfig.json` | Strict TypeScript, ES2021, `src/**/*.ts` only |
| Lint rules | `eslint.config.mts` | Obsidian recommended plugin lint rules |
| Release metadata | `manifest.json`, `versions.json` | Keep plugin version and min app version aligned |
| Version bumping | `version-bump.mjs`, `package.json` | `npm run version` updates and stages manifest/versions |
| CI | `.github/workflows/lint.yml` | Runs `npm ci`, build, lint on Node 20, 22, 24 |
| GitHub release | `.github/workflows/release.yml` | Tag name becomes draft release title; assets are root artifacts |

## CODE MAP

Refs were inferred from direct source inspection because TypeScript LSP and codegraph were unavailable during generation.

| Symbol | Type | Location | Refs | Role |
| --- | --- | --- | --- | --- |
| `MyPlugin` | default class | `src/main.ts` | central | Obsidian plugin entry and lifecycle owner |
| `onload` | method | `src/main.ts` | central | Loads settings; registers ribbon, status bar, commands, settings tab, listeners |
| `loadSettings` | method | `src/main.ts` | 1 | Merges persisted data with defaults |
| `saveSettings` | method | `src/main.ts` | 1 | Persists plugin settings via `saveData` |
| `SampleModal` | class | `src/main.ts` | 2 | Inline modal used by simple and complex commands |
| `MyPluginSettings` | interface | `src/settings.ts` | 3 | Persisted settings shape |
| `DEFAULT_SETTINGS` | const | `src/settings.ts` | 1 | Default persisted setting values |
| `SampleSettingTab` | class | `src/settings.ts` | 1 | Obsidian settings tab UI |

## CONVENTIONS

- Use `npm`; scripts are defined in `package.json`.
- Keep source under `src/`; `tsconfig.json` includes only `src/**/*.ts`.
- Keep `src/main.ts` focused on plugin lifecycle and registration. Move feature logic into `src/commands/`, `src/ui/`, `src/utils/`, or other focused modules when adding real behavior.
- Do not hand-edit `main.js`; regenerate it with `npm run build` or `npm run dev`.
- Keep `manifest.json` `id` stable. Current ID is `sample-plugin`.
- Preserve mobile compatibility while `manifest.json` has `"isDesktopOnly": false`.
- Use `this.loadData()` and `this.saveData()` for persisted plugin settings.
- Register Obsidian events, DOM events, and intervals through plugin registration helpers so unload cleans them up.
- Use stable command IDs once a command has shipped.
- Formatting follows `.editorconfig`: UTF-8, LF, final newline, tabs width 4, single quotes.

## ANTI-PATTERNS

- Do not introduce network calls, telemetry, or third-party service traffic unless the feature clearly requires it, the user opts in, and the README/settings disclose it.
- Do not execute remote code, fetch scripts for evaluation, or self-update outside normal releases.
- Do not use Node or Electron APIs for feature code unless the plugin intentionally becomes desktop-only.
- Do not scan the vault or do heavy work during `onload`; defer expensive work until a command or explicit UI action needs it.
- Do not store or transmit vault contents, filenames, or personal data unless essential and explicitly consented.
- Do not leave broad DOM listeners, timers, or app events outside `registerDomEvent`, `registerInterval`, or `registerEvent`.
- Treat the current `console.log('setInterval')` interval as sample behavior; remove or justify it when productizing.

## UNIQUE STYLES

- The implementation is still sample-shaped: `MyPlugin`, `SampleModal`, and `SampleSettingTab` names are placeholders.
- `SampleModal` is inline in `src/main.ts`; split it to `src/ui/` if it grows beyond trivial sample UI.
- Settings currently contain one string field, `mySetting`; validate and migrate settings if the schema expands.
- There are no markdown processors, workspace views, custom views, or test harnesses yet.
- `styles.css` is present and optional for releases; keep selectors scoped to plugin UI when adding styles.

## COMMANDS

```bash
npm install
npm run dev
npm run build
npm run lint
npm run version
```

## VERIFICATION

- Primary automated checks: `npm run build` and `npm run lint`.
- CI runs the same checks on Node 20.x, 22.x, and 24.x.
- No automated test framework or `npm test` script exists.
- Manual smoke test in Obsidian: build, copy `main.js`, `manifest.json`, and `styles.css` into `<Vault>/.obsidian/plugins/sample-plugin/`, reload Obsidian, enable the plugin, then check ribbon notice, command palette commands, editor replacement, modal opening, and settings persistence.

## RELEASE NOTES

- `npm run version` syncs `manifest.json.version` from `package.json` and adds missing `versions.json` entries.
- GitHub release tags must match `manifest.json` version exactly, with no leading `v`.
- Release assets are individual files: `manifest.json`, `main.js`, and `styles.css` when present.
- `.github/workflows/release.yml` creates a draft release on every tag push.

## HIERARCHY DECISION

- Root `AGENTS.md` only.
- `src/` was not given a child file: 2 TypeScript files, no nested directories, no local config, and no separate conventions.
- Reconsider a child `src/AGENTS.md` after feature modules, tests, or UI/components create distinct local rules.
