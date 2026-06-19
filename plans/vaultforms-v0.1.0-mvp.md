# VaultForms v0.1.0 MVP Implementation Plan

## TL;DR

Build the first usable VaultForms workflow: a vanilla Obsidian modal form picker, four starter forms, Markdown note generation with YAML frontmatter, starter `.base` files, basic settings, pure generator tests, and release-ready verification. Do not add AI, network calls, telemetry, servers, auth, payments, stock APIs, or investment advice.

The implementation should stay small and local-first. Keep `src/main.ts` as lifecycle-only glue, put product logic in typed modules under `src/`, and test the generators before wiring them to Obsidian UI.

## Current Evidence

- Current command placeholder is in `src/main.ts:4-18`; replace the callback with the real picker while preserving command id `open-form-picker`.
- Current settings placeholder is in `src/settings.ts:4-18`; expand it into real plugin settings.
- Build and lint scripts are `npm run build` and `npm run lint` in `package.json:7-11`.
- TypeScript is strict and only includes `src/**/*.ts` in `tsconfig.json:2-18`.
- ESLint uses `eslint-plugin-obsidianmd` recommended rules in `eslint.config.mts:1-33`.
- README already describes manual installation and command verification in `README.md:27-31`.
- Obsidian type definitions expose `Modal`, `PluginSettingTab`, `Setting`, `Vault.create`, `Vault.createFolder`, `normalizePath`, `parseYaml`, and `stringifyYaml` in `node_modules/obsidian/obsidian.d.ts`.
- Official Obsidian Bases docs say `.base` files are valid YAML and define `filters`, `formulas`, `properties`, `summaries`, and `views`: https://obsidian.md/help/bases/syntax
- Official Obsidian Properties docs say note properties are stored as YAML frontmatter and support text, list, number, checkbox, date, date-time, and tags: https://obsidian.md/help/properties

## Scope

### Must Have

- Add a working **VaultForms: Open form picker** flow.
- Provide four MVP forms:
  - Dev Log
  - Link Capture
  - Idea Capture
  - Stock Research
- Render forms with vanilla Obsidian UI (`Modal`, `Setting`, native inputs), not React.
- Create Markdown notes with valid YAML frontmatter.
- Create starter `.base` YAML files so users can view collected notes in Obsidian Bases.
- Add plugin settings for output locations and base generation behavior.
- Add tests for pure generator functions.
- Keep desktop/mobile compatibility where possible.
- Keep `npm run build` and `npm run lint` passing.

### Must Not Have

- No AI API, OCR, voice transcription, stock price API, investment advice, telemetry, server, login, payment, or separate mobile app.
- No network calls.
- No Node/Electron APIs in product code.
- No React or framework UI.
- No vault-wide scans during `onload`.
- No overwriting user-edited notes or `.base` files.
- No generated `main.js` hand edits.

## Product Defaults

- Default entries folder: `VaultForms/Entries`
- Default bases folder: `VaultForms/Bases`
- Default note path: `VaultForms/Entries/<Form Name>/<YYYY-MM-DD-HHmm>-<slug>.md`
- Default base path: `VaultForms/Bases/<Form Name>.base`
- Starter `.base` files are created only if missing.
- Created notes include common frontmatter:
  - `vaultforms_form`
  - `vaultforms_version`
  - `created`
  - `tags`
- Use form-specific tags:
  - `vaultforms/dev-log`
  - `vaultforms/link`
  - `vaultforms/idea`
  - `vaultforms/stock-research`
- Stock Research copy must include a visible non-advice disclaimer in the modal and note body.

## Architecture

### Proposed Files

- `src/main.ts`
  - Keep lifecycle-only.
  - Load/save settings.
  - Register command.
  - Register settings tab.
- `src/settings.ts`
  - Settings interface, defaults, settings tab, validation.
- `src/commands/registerCommands.ts`
  - Register `open-form-picker`.
- `src/forms/types.ts`
  - Form definition, field definition, submission, frontmatter value types.
- `src/forms/definitions.ts`
  - The four MVP form definitions.
- `src/forms/markdown.ts`
  - Pure Markdown/frontmatter rendering.
- `src/forms/base.ts`
  - Pure `.base` YAML model and rendering.
- `src/forms/paths.ts`
  - Pure slug/date/path generation helpers.
- `src/forms/validation.ts`
  - Required field and type validation.
- `src/forms/yaml.ts`
  - Small constrained YAML emitter for strings, numbers, booleans, lists, and flat/nested maps.
- `src/services/vault-writer.ts`
  - Obsidian vault integration: ensure folders, avoid overwrites, create note, create missing base files.
- `src/ui/form-picker-modal.ts`
  - List forms and open selected form modal.
- `src/ui/form-entry-modal.ts`
  - Render fields, validate, submit, show success/error Notice.
- `src/ui/field-controls.ts`
  - Small helpers for text, textarea, date, checkbox, select.
- `tests/forms/markdown.test.ts`
- `tests/forms/base.test.ts`
- `tests/forms/paths.test.ts`
- `tests/forms/validation.test.ts`
- `tests/forms/yaml.test.ts`
- `vitest.config.mts`

## Data Model

### Field Types

- `text`
- `textarea`
- `date`
- `datetime`
- `url`
- `number`
- `checkbox`
- `select`
- `tags`

### Form Definition Shape

Each form definition should include:

- stable `id`
- display `name`
- description
- default folder segment
- base filename
- form tag
- fields with stable property keys
- note title strategy
- note body sections
- base columns
- optional disclaimer

Use `as const` definitions plus typed helpers so property keys stay consistent across note generation and `.base` generation.

### MVP Form Fields

Dev Log:

- `date` date, required, default today
- `project` text, required
- `summary` text, required
- `details` textarea, optional
- `status` select: `planned`, `in-progress`, `blocked`, `done`
- `blockers` textarea, optional
- `next_action` text, optional

Link Capture:

- `url` url, required
- `title` text, required
- `topic` text, optional
- `source` text, optional
- `status` select: `to-read`, `reading`, `saved`, `archived`
- `notes` textarea, optional

Idea Capture:

- `idea` text, required
- `area` text, optional
- `status` select: `new`, `incubating`, `next`, `done`
- `impact` select: `low`, `medium`, `high`
- `effort` select: `small`, `medium`, `large`
- `next_action` text, optional
- `notes` textarea, optional

Stock Research:

- `ticker` text, required
- `company` text, optional
- `research_date` date, required, default today
- `thesis` textarea, optional
- `risks` textarea, optional
- `source_url` url, optional
- `status` select: `watching`, `researching`, `review-later`, `archived`
- `notes` textarea, optional

Stock Research must not fetch prices, rate stocks, recommend trades, or imply investment advice.

## YAML And Markdown Rules

- Generate frontmatter at the top of the note:

```yaml
---
vaultforms_form: "dev-log"
vaultforms_version: "0.1.0"
created: "2026-06-19T14:00:00"
tags:
  - "vaultforms/dev-log"
project: "Example"
---
```

- Emit body content after frontmatter with readable headings.
- Keep long textarea content in Markdown body, not YAML frontmatter, unless the field is explicitly needed in Bases.
- Use date strings as `YYYY-MM-DD`.
- Use datetime strings as ISO-like local strings.
- Quote YAML strings using JSON-compatible double-quoted escaping.
- Do not emit empty optional properties into frontmatter.
- For `.base` files, use official Bases YAML structure:

```yaml
filters:
  and:
    - file.inFolder("VaultForms/Entries/Dev Log")
    - 'vaultforms_form == "dev-log"'
properties:
  vaultforms_form:
    displayName: "Form"
views:
  - type: table
    name: "Dev Log"
    order:
      - file.name
      - date
      - project
      - status
```

## Test Strategy

Add Vitest for pure generator tests:

- Add dev dependency `vitest`.
- Add dev dependency `yaml` only for test parsing/validation if needed.
- Add scripts:
  - `test`: `vitest run`
  - `test:watch`: `vitest`
- Keep production code free of new runtime dependencies unless a later implementation proves the constrained YAML emitter is unsafe.

Pure functions to test:

- YAML scalar quoting and list/map rendering.
- Markdown note rendering for each form.
- Omission of empty optional fields.
- Preservation of required frontmatter keys.
- `.base` YAML rendering for all four forms.
- Date/file slug generation.
- Validation for required fields and malformed URLs.
- Filename collision path fallback.

Avoid tests that depend on real Obsidian app state. Use pure data inputs and exact parsed assertions.

## Execution Strategy

### Wave 1 - Foundations And Tests

- [ ] 1. Add test tooling.
  - Files: `package.json`, `package-lock.json`, `vitest.config.mts`
  - Must do: add `vitest`, `test`, and `test:watch`; keep npm as package manager.
  - Must not do: replace ESLint/build tooling.
  - Acceptance: `npm run test` exits 0 once initial tests exist.
  - QA happy: run `npm run test`; evidence `.omo/evidence/vaultforms-mvp/task-01-test-tooling.txt`.
  - QA failure: intentionally run a missing test pattern in dry check or verify Vitest exits non-zero for a temporary failing assertion before finalizing; evidence `.omo/evidence/vaultforms-mvp/task-01-red-proof.txt`.
  - Commit: `chore(test): add vitest for generator tests`

- [ ] 2. Define form and value types.
  - Files: `src/forms/types.ts`
  - Must do: create readonly typed definitions for field types, form IDs, field values, submissions, generator results.
  - Must not do: use `any`, enums, or runtime Obsidian APIs.
  - Acceptance: `npm run build` type-checks the new module.
  - QA happy: `npm run build`; evidence `.omo/evidence/vaultforms-mvp/task-02-types-build.txt`.
  - QA failure: compile should reject invalid form id in a small test fixture or type-level test comment is not enough; prefer runtime unit tests for validation later.
  - Commit: `feat(forms): define typed form model`

- [ ] 3. Add constrained YAML renderer with tests.
  - Files: `src/forms/yaml.ts`, `tests/forms/yaml.test.ts`
  - Must do: support string, number, boolean, string list, flat map, nested map, and array of maps used by `.base`.
  - Must not do: support arbitrary objects or YAML anchors.
  - Acceptance: tests parse generated YAML with `yaml` dev parser and assert values.
  - QA happy: `npm run test -- tests/forms/yaml.test.ts`; evidence `.omo/evidence/vaultforms-mvp/task-03-yaml-test.txt`.
  - QA failure: malformed scalar with colon, quote, newline, and bracket characters is tested.
  - Commit: `feat(forms): add constrained yaml renderer`

- [ ] 4. Add form definitions.
  - Files: `src/forms/definitions.ts`, `tests/forms/definitions.test.ts`
  - Must do: define all four forms with fields, defaults, base columns, tags, and disclaimers.
  - Must not do: add API-backed fields.
  - Acceptance: tests assert exactly four forms and stable IDs.
  - QA happy: `npm run test -- tests/forms/definitions.test.ts`; evidence `.omo/evidence/vaultforms-mvp/task-04-definitions-test.txt`.
  - QA failure: test catches duplicate field keys and missing required title field.
  - Commit: `feat(forms): add vaultforms mvp definitions`

### Wave 2 - Generators

- [ ] 5. Implement path and slug generation.
  - Files: `src/forms/paths.ts`, `tests/forms/paths.test.ts`
  - Must do: normalize unsafe title text into filename slugs; generate note and base paths from settings + form id + current date.
  - Must not do: access the vault or filesystem.
  - Acceptance: tests cover spaces, punctuation, empty title fallback, ticker casing, and path normalization.
  - QA happy: `npm run test -- tests/forms/paths.test.ts`; evidence `.omo/evidence/vaultforms-mvp/task-05-paths-test.txt`.
  - QA failure: path traversal attempts like `../bad` are sanitized.
  - Commit: `feat(forms): generate safe vault paths`

- [ ] 6. Implement form validation.
  - Files: `src/forms/validation.ts`, `tests/forms/validation.test.ts`
  - Must do: validate required fields, URL fields, date fields, select values, and stock disclaimer-safe behavior.
  - Must not do: validate by throwing for expected user errors; return typed result.
  - Acceptance: tests cover valid and invalid submissions for all four forms.
  - QA happy: `npm run test -- tests/forms/validation.test.ts`; evidence `.omo/evidence/vaultforms-mvp/task-06-validation-test.txt`.
  - QA failure: malformed URL and missing required field produce user-readable error messages.
  - Commit: `feat(forms): validate form submissions`

- [ ] 7. Implement Markdown note generator.
  - Files: `src/forms/markdown.ts`, `tests/forms/markdown.test.ts`
  - Must do: render frontmatter and body for each form.
  - Must not do: write files or use Obsidian APIs.
  - Acceptance: generated Markdown starts with valid frontmatter and includes non-empty body headings.
  - QA happy: `npm run test -- tests/forms/markdown.test.ts`; evidence `.omo/evidence/vaultforms-mvp/task-07-markdown-test.txt`.
  - QA failure: empty optional fields are omitted from frontmatter/body; special characters remain valid YAML.
  - Commit: `feat(forms): render markdown notes`

- [ ] 8. Implement `.base` generator.
  - Files: `src/forms/base.ts`, `tests/forms/base.test.ts`
  - Must do: render one starter table base per form using official Bases YAML shape.
  - Must not do: include unsupported `from`/SQL/Dataview syntax.
  - Acceptance: tests parse generated `.base` YAML and assert `filters`, `properties`, and `views[0]`.
  - QA happy: `npm run test -- tests/forms/base.test.ts`; evidence `.omo/evidence/vaultforms-mvp/task-08-base-test.txt`.
  - QA failure: tests assert generated YAML does not contain `from:` and filters include both folder and `vaultforms_form`.
  - Commit: `feat(forms): render starter base files`

### Wave 3 - Obsidian Integration

- [ ] 9. Add settings persistence.
  - Files: `src/settings.ts`, `src/main.ts`, `tests/forms/settings-defaults.test.ts`
  - Must do: add `VaultFormsSettings`, `DEFAULT_SETTINGS`, `loadSettings`, `saveSettings`.
  - Settings: entries folder, bases folder, create bases on submit, open note after submit.
  - Must not do: add cloud/network settings.
  - Acceptance: build passes and defaults match product defaults.
  - QA happy: `npm run build && npm run test -- tests/forms/settings-defaults.test.ts`; evidence `.omo/evidence/vaultforms-mvp/task-09-settings.txt`.
  - QA failure: invalid blank folder falls back or is rejected with a visible setting description.
  - Commit: `feat(settings): add vaultforms output settings`

- [ ] 10. Add vault writer service.
  - Files: `src/services/vault-writer.ts`, `tests/forms/vault-writer-plan.test.ts` if a pure fake can be introduced safely
  - Must do: ensure folders with `Vault.createFolder`, create notes with `Vault.create`, create `.base` only when missing, avoid overwrites by suffixing note filenames.
  - Must not do: overwrite existing `.base` files or scan the whole vault.
  - Acceptance: build passes; fake adapter tests cover missing/existing paths if practical.
  - QA happy: run targeted tests/build; evidence `.omo/evidence/vaultforms-mvp/task-10-writer.txt`.
  - QA failure: simulated existing note path produces `-2` suffix; existing base is skipped.
  - Commit: `feat(vault): write notes and starter bases`

- [ ] 11. Replace command callback with form picker.
  - Files: `src/main.ts`, `src/commands/registerCommands.ts`
  - Must do: command opens `FormPickerModal`; preserve id `open-form-picker` and name `VaultForms: Open form picker`.
  - Must not do: add ribbon/status bar sample behavior.
  - Acceptance: runtime smoke shows command count 1 and command name unchanged.
  - QA happy: node/VM Obsidian-stub smoke similar to existing evidence; evidence `.omo/evidence/vaultforms-mvp/task-11-command-smoke.txt`.
  - QA failure: obsolete sample strings scan still returns no matches.
  - Commit: `feat(commands): open form picker command`

### Wave 4 - UI

- [ ] 12. Build form picker modal.
  - Files: `src/ui/form-picker-modal.ts`
  - Must do: list four forms with descriptions and a select/open action.
  - Must not do: use React or external UI packages.
  - Acceptance: command opens modal in runtime smoke with rendered form names if testable through DOM stubs.
  - QA happy: manual Obsidian scenario below; evidence `.omo/evidence/vaultforms-mvp/task-12-picker-manual.md`.
  - QA failure: keyboard-only selection path works or has documented fallback.
  - Commit: `feat(ui): add form picker modal`

- [ ] 13. Build form entry modal.
  - Files: `src/ui/form-entry-modal.ts`, `src/ui/field-controls.ts`
  - Must do: render fields, validate on submit, show errors inline, submit to writer.
  - Must not do: silently create files on invalid input.
  - Acceptance: build/lint pass; manual QA creates notes for all four forms.
  - QA happy: fill Dev Log and Link Capture; evidence `.omo/evidence/vaultforms-mvp/task-13-entry-happy.md`.
  - QA failure: submit with missing required title/project shows error and creates no file; evidence `.omo/evidence/vaultforms-mvp/task-13-entry-failure.md`.
  - Commit: `feat(ui): add form entry modal`

- [ ] 14. Wire submit success behavior.
  - Files: `src/ui/form-entry-modal.ts`, `src/services/vault-writer.ts`
  - Must do: show success Notice, close modal only after successful write, optionally open created note based on setting.
  - Must not do: swallow write errors.
  - Acceptance: failed write displays user-readable Notice and keeps inputs.
  - QA happy: successful submit creates note and bases; evidence `.omo/evidence/vaultforms-mvp/task-14-success.md`.
  - QA failure: fake write failure or read-only path shows error without losing data.
  - Commit: `feat(ui): complete submit flow`

### Wave 5 - Documentation And Polish

- [ ] 15. Update README for MVP workflow.
  - Files: `README.md`
  - Must do: explain what the four forms do, where files are created, how to open generated bases, and strict non-goals.
  - Must not do: promise stock prices, AI extraction, or sync.
  - Acceptance: README names all four forms and no forbidden feature.
  - QA happy: `rg "Dev Log|Link Capture|Idea Capture|Stock Research" README.md`; evidence `.omo/evidence/vaultforms-mvp/task-15-readme.txt`.
  - QA failure: `rg "AI API|stock price API|investment advice|telemetry|server|login|payment" README.md` only appears under non-goals.
  - Commit: `docs: describe vaultforms mvp workflow`

- [ ] 16. Update AGENTS.md knowledge base.
  - Files: `AGENTS.md`
  - Must do: replace stale sample-plugin references with VaultForms module map after implementation.
  - Must not do: add generic Obsidian docs that do not apply.
  - Acceptance: `rg "sample-plugin|SampleModal|open-modal|replace-selected" AGENTS.md` returns no matches.
  - QA happy: `rg "VaultForms|forms|base" AGENTS.md`; evidence `.omo/evidence/vaultforms-mvp/task-16-agents.txt`.
  - QA failure: stale sample command references are absent.
  - Commit: `docs: update agent knowledge for vaultforms`

- [ ] 17. Add release notes/checklist for v0.1.0.
  - Files: `README.md` or `RELEASE.md`
  - Must do: document release artifact checklist and manual smoke scenarios.
  - Must not do: change version unless release metadata is intentionally bumped.
  - Acceptance: release checklist includes `manifest.json`, `main.js`, `styles.css`, build, lint, test, manual install.
  - QA happy: checklist reviewed by grep; evidence `.omo/evidence/vaultforms-mvp/task-17-release-docs.txt`.
  - Commit: `docs: add v0.1.0 release checklist`

## Dependency Matrix

| Todo | Depends on | Blocks | Can parallelize with |
| --- | --- | --- | --- |
| 1 | none | 3-8 tests | 2 |
| 2 | none | 4-8 | 1 |
| 3 | 1, 2 | 7, 8 | 4, 5, 6 |
| 4 | 1, 2 | 6-8, 12-13 | 3, 5 |
| 5 | 1, 2 | 10 | 3, 4, 6 |
| 6 | 1, 2, 4 | 13 | 3, 5, 7, 8 |
| 7 | 3, 4, 6 | 10 | 8 |
| 8 | 3, 4 | 10 | 7 |
| 9 | 2 | 10-14 | 7, 8 |
| 10 | 5, 7, 8, 9 | 13-14 | 11 |
| 11 | 9 | 12 | 10 |
| 12 | 4, 11 | 13 | none |
| 13 | 6, 10, 12 | 14 | none |
| 14 | 10, 13 | final QA | 15-17 |
| 15 | core behavior stable | release | 16, 17 |
| 16 | core behavior stable | future agent work | 15, 17 |
| 17 | core behavior stable | release | 15, 16 |

Critical path: 1 -> 2 -> 3/4/6 -> 7/8 -> 10 -> 13 -> 14 -> final QA.

## Manual QA Scenarios

Run these in a real Obsidian vault after `npm run build`.

- [ ] QA1. Install/load
  - Copy `main.js`, `manifest.json`, `styles.css` into `<Vault>/.obsidian/plugins/vaultforms/`.
  - Enable VaultForms.
  - Expected: plugin loads with no console error.
  - Evidence: screenshot or log at `.omo/evidence/vaultforms-mvp/manual-qa-load.md`.

- [ ] QA2. Command palette
  - Open command palette.
  - Run **VaultForms: Open form picker**.
  - Expected: picker modal shows Dev Log, Link Capture, Idea Capture, Stock Research.
  - Evidence: screenshot at `.omo/evidence/vaultforms-mvp/manual-qa-picker.png`.

- [ ] QA3. Dev Log happy path
  - Submit a Dev Log with project, summary, status, date.
  - Expected: Markdown note created under `VaultForms/Entries/Dev Log/`; Dev Log base created under `VaultForms/Bases/`.
  - Evidence: created file paths and frontmatter snippet.

- [ ] QA4. Link Capture URL validation
  - Submit Link Capture with invalid URL.
  - Expected: visible validation error; no note created.
  - Evidence: screenshot plus file count before/after.

- [ ] QA5. Idea Capture happy path
  - Submit Idea Capture with idea, impact, effort, next action.
  - Expected: note frontmatter has `vaultforms_form: "idea-capture"` and tag `vaultforms/idea`.
  - Evidence: frontmatter snippet.

- [ ] QA6. Stock Research guardrail
  - Submit Stock Research without price data.
  - Expected: no API call, no investment recommendation, note includes research/disclaimer copy.
  - Evidence: note body snippet and network-free assertion from source scan.

- [ ] QA7. Existing base preservation
  - Manually edit one generated `.base`, then submit another form of the same type.
  - Expected: existing `.base` is not overwritten.
  - Evidence: before/after diff.

- [ ] QA8. Mobile smoke
  - On mobile where possible, open picker, fill one small form, submit.
  - Expected: no desktop-only API failure.
  - Evidence: screenshot or note path.

## Final Verification Wave

- [ ] F1. Run `npm run test`.
- [ ] F2. Run `npm run build`.
- [ ] F3. Run `npm run lint`.
- [ ] F4. Run obsolete feature scan:

```bash
rg "AI API|OCR|voice transcription|stock price API|investment advice|telemetry|server|login|payment" src README.md
```

Expected: only README non-goals/disclaimer references, no implementation hooks.

- [ ] F5. Run generated artifact scan:

```bash
rg "open-form-picker|VaultForms: Open form picker|Dev Log|Link Capture|Idea Capture|Stock Research" src tests README.md
```

- [ ] F6. Run real Obsidian manual QA scenarios QA1-QA8.
- [ ] F7. Inspect generated Markdown and `.base` files with a YAML parser or Obsidian source mode.
- [ ] F8. Confirm generated `main.js` is from build, not hand-edited.

## Release Checklist

- [ ] `manifest.json` remains:
  - `id`: `vaultforms`
  - `name`: `VaultForms`
  - `version`: `0.1.0`
  - `minAppVersion`: `1.9.10`
  - `isDesktopOnly`: `false`
- [ ] `versions.json` maps `0.1.0` to `1.9.10`.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run lint` passes.
- [ ] Manual QA evidence exists.
- [ ] README describes install, usage, forms, non-goals, and release assets.
- [ ] `main.js`, `manifest.json`, and `styles.css` are ready as release assets.
- [ ] Release tag is exactly `0.1.0`, no leading `v`.
- [ ] No network/telemetry/server/login/payment code exists.

## Success Criteria

- Command palette shows **VaultForms: Open form picker**.
- Picker lists four MVP forms.
- Each form can create a Markdown note with valid YAML frontmatter.
- Starter `.base` files are valid YAML and can be opened by Obsidian Bases.
- Existing user `.base` files are not overwritten.
- Pure generator tests cover Markdown, YAML, path, validation, and base generation.
- `npm run test`, `npm run build`, and `npm run lint` pass.
- Strict non-goals are preserved.
