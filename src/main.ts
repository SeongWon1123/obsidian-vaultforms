import { Notice, Plugin } from 'obsidian';
import { VaultFormsSettingTab } from './settings';

export default class VaultFormsPlugin extends Plugin {
	onload(): void {
		this.addCommand({
			id: 'open-form-picker',
			// eslint-disable-next-line obsidianmd/commands/no-plugin-name-in-command-name, obsidianmd/ui/sentence-case -- Required stable command name.
			name: 'VaultForms: Open form picker',
			callback: () => {
				new Notice('The form picker is not available yet.');
			},
		});

		this.addSettingTab(new VaultFormsSettingTab(this.app, this));
	}

	onunload(): void {}
}
