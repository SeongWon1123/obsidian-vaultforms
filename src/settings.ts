import { App, PluginSettingTab, Setting } from 'obsidian';
import type VaultFormsPlugin from './main';

export class VaultFormsSettingTab extends PluginSettingTab {
	constructor(app: App, plugin: VaultFormsPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Forms')
			.setDesc('No settings are available yet.');
	}
}
