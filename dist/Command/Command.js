"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Command {
    constructor(name, options) {
        this._name = name;
        const { description = "", category = "", usage = "", aliases = [], permissions = [], commandTips = [], botOwnerOnly = false } = options;
        this._description = description;
        this._usage = usage;
        this._category = category;
        this._aliases = aliases;
        this._permissions = permissions;
        this._commandTips = commandTips;
        this._botOwnerOnly = botOwnerOnly;
    }
    async execute(commandArguments) {
        throw new Error(`Command ${this._name} does not provide a execute method.`);
    }
    setInstance(instance) {
        this._instance = instance;
    }
    setGuild(guild) {
        this._guild = guild;
    }
    setCommandFile(file) {
        this._commandFile = file;
    }
    getRandomCommandTip() {
        return "**TIP:** " + this._commandTips[Math.floor(Math.random() * this._commandTips.length)]
            .replaceAll("%prefix%", this._guild.prefix);
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get category() {
        return this._category;
    }
    get usage() {
        return this._usage;
    }
    get aliases() {
        return this._aliases;
    }
    get permissions() {
        return this._permissions;
    }
    get commandTips() {
        return this._commandTips;
    }
    get botOwnerOnly() {
        return this._botOwnerOnly;
    }
    get commandFile() {
        return this._commandFile;
    }
    get instance() {
        return this._instance;
    }
    get guild() {
        return this._guild;
    }
}
exports.default = Command;
