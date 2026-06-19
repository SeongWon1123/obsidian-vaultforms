Convert the Obsidian sample plugin scaffold into the VaultForms baseline.

Tasks:
- Rename plugin identity to VaultForms.
- Update package.json name to obsidian-vaultforms.
- Update manifest.json:
  - id: vaultforms
  - name: VaultForms
  - version: 0.1.0
  - minAppVersion: 1.9.10
  - description: Forms that turn your Obsidian vault into a structured database.
  - author: wellnessmaker
  - isDesktopOnly: false
- Remove sample plugin demo behavior.
- Add command:
  VaultForms: Open form picker
- Add placeholder settings tab.
- Keep build working.

Completion promise:
- npm run build passes
- Obsidian loads plugin
- command palette shows VaultForms command
