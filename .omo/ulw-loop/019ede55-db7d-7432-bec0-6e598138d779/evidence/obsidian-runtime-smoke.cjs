const fs = require('fs');
const path = require('path');
const vm = require('vm');
class Plugin {
  constructor() {
    this.app = { name: 'stub-app' };
    this.commands = [];
    this.settingTabs = [];
  }
  addCommand(command) {
    this.commands.push(command);
  }
  addSettingTab(tab) {
    this.settingTabs.push(tab);
  }
}
class PluginSettingTab {
  constructor(app, plugin) {
    this.app = app;
    this.plugin = plugin;
    this.containerEl = { empty() {} };
  }
}
class Setting {
  constructor(containerEl) {
    this.containerEl = containerEl;
  }
  setName(name) {
    this.name = name;
    return this;
  }
  setDesc(desc) {
    this.desc = desc;
    return this;
  }
}
const notices = [];
class Notice {
  constructor(message) {
    notices.push(message);
  }
}
const moduleObject = { exports: {} };
const sandbox = {
  module: moduleObject,
  exports: moduleObject.exports,
  require(request) {
    if (request === 'obsidian') {
      return { Notice, Plugin, PluginSettingTab, Setting };
    }
    return require(request);
  },
};
const source = fs.readFileSync(path.join(process.cwd(), 'main.js'), 'utf8');
vm.runInNewContext(source, sandbox, { filename: 'main.js' });
const PluginClass = moduleObject.exports.default;
const plugin = new PluginClass();
plugin.onload();
const [command] = plugin.commands;
if (!command) {
  throw new Error('No command registered');
}
command.callback();
console.log(JSON.stringify({
  commandCount: plugin.commands.length,
  commandId: command.id,
  commandName: command.name,
  settingTabCount: plugin.settingTabs.length,
  notice: notices[0]
}, null, 2));
