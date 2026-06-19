# VaultForms

Forms that turn your Obsidian vault into a structured database.

VaultForms is an Obsidian community plugin. This baseline keeps the plugin intentionally small: it registers a command palette entry for opening the future form picker and exposes a placeholder settings tab.

## Development

- Install dependencies with `npm install`.
- Run `npm run dev` for esbuild watch mode.
- Run `npm run build` for a production build.
- Run `npm run lint` before submitting changes.

## Manual installation

Build the plugin, then copy these files into your vault:

```text
<Vault>/.obsidian/plugins/vaultforms/
  main.js
  manifest.json
  styles.css
```

Reload Obsidian and enable **VaultForms** in **Settings -> Community plugins**.

## Verification

- `npm run build` type-checks and bundles the plugin.
- In Obsidian, confirm the command palette shows **VaultForms: Open form picker**.
- Confirm the plugin settings page shows the VaultForms placeholder settings tab.

## Release

- Keep `package.json`, `manifest.json`, and `versions.json` version metadata aligned.
- Tags must match `manifest.json` version exactly, with no leading `v`.
- Attach `manifest.json`, `main.js`, and `styles.css` to releases as individual assets.

## API documentation

See https://docs.obsidian.md
