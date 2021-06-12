"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Manager_1 = __importDefault(require("../Utils/Manager"));
const Command_1 = __importDefault(require("./Command"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const discord_js_1 = require("discord.js");
const glob = util_1.promisify(require('glob'));
class CommandManager extends Manager_1.default {
    constructor(instance) {
        super(instance);
        this._commands = new Map();
        this.loadCommands(instance, instance.client, `${__dirname}${path_1.default.sep}Commands`, false);
        instance.client.on("message", async (message) => {
            const { guild, member, author, content, channel } = message;
            if (!guild || author.bot)
                return;
            if (!member)
                return;
            let guildData = instance.guildManager.getGuild(guild.id);
            if (guildData === undefined) {
                await instance.guildManager.createGuild(guild.id);
                guildData = instance.guildManager.getGuild(guild.id);
            }
            let userData = instance.userDataManager.getUserData(author.id);
            if (userData === undefined) {
                await instance.userDataManager.createUserData(author.id);
                userData = instance.userDataManager.getUserData(author.id);
            }
            if (guildData === undefined)
                return;
            if (userData === undefined)
                return;
            const prefix = guildData.prefix;
            if (prefix === undefined)
                return;
            if (!content.toLowerCase().startsWith(prefix.toLowerCase()))
                return;
            const [cmd, ...args] = content.slice(prefix.length).trim().split(/ +/g);
            const command = this.getCommandByName(cmd);
            if (command) {
                if (command.botOwnerOnly) {
                    if (member.id !== "510639833811517460") {
                        return (await channel.send(`You do not own me and cannot use this command.\n*This message will be automatically deleted in 5 seconds.*`)).delete({ timeout: 5000 });
                    }
                }
                if (command.permissions.length > 0) {
                    if (member.id !== "510639833811517460") {
                        const missingPermissions = [];
                        command.permissions.forEach(permission => {
                            if (!member?.hasPermission(permission)) {
                                missingPermissions.push(permission);
                            }
                        });
                        if (missingPermissions.length !== 0) {
                            return (await channel.send(`You are missing the permission${missingPermissions.length > 1 ? 's' : ''} \`${missingPermissions.join(', ')}\` and cannot use this command.\n*This message will be automatically deleted in 5 seconds.*`)).delete({ timeout: 5000 });
                        }
                    }
                }
                command.setInstance(instance);
                command.setGuild(guildData);
                await command.execute({
                    args: args,
                    channel: channel,
                    client: instance.client,
                    instance: instance,
                    message: message,
                    prefix: guildData.prefix,
                    text: args.join(" "),
                    guildSettings: guildData,
                    userData: userData
                }).catch((err) => {
                    channel.send(new discord_js_1.MessageEmbed()
                        .setAuthor("Command Execution Error")
                        .setColor("RED")
                        .setDescription("help, i have mc fallen qwq <:winky:848021877942124584>\nIf this is an actual issue, please message Fascinated#4735\n\n**Error:**\n" + err));
                    super.logger.log(`Command ${command.name} has failed to execute.`);
                    super.logger.log(err);
                    super.logger.log(err.stack);
                });
            }
        });
    }
    async loadCommands(instance, client, directory, silentLoad, reload) {
        if (directory === undefined)
            return [];
        return glob(`${directory}\\**\\*.js`).then(async (commands) => {
            for (const commandFile of commands) {
                await this.registerCommand(instance, client, commandFile).catch(() => super.logger.log("Failed to load cmd!"));
            }
            if (!silentLoad) {
                if (this._commands.size > 0) {
                    super.logger.log(`${reload == true ? "Rel" : "L"}oaded ${this._commands.size} command${this._commands.size > 1 ? 's' : ''}.`);
                }
            }
        });
    }
    getCommandByName(name) {
        let toReturn = undefined;
        this._commands.forEach(command => {
            if (toReturn)
                return toReturn;
            if (command.name === name)
                toReturn = command;
            if (command.aliases) {
                command.aliases.forEach(alias => {
                    if (alias === name)
                        toReturn = command;
                });
            }
        });
        return toReturn;
    }
    async registerCommand(instance, client, commandFile) {
        return new Promise(async (resolve, reject) => {
            const { name } = path_1.default.parse(commandFile);
            try {
                delete require.cache[commandFile];
                let File = await require(commandFile);
                if (!instance.utils.isClass(File)) {
                    super.logger.warn(`BatFramework > Command ${name} doesn't export a class!`);
                    reject(true);
                    return;
                }
                const command = await new File(client, name.toLowerCase());
                if (!(await command instanceof Command_1.default)) {
                    super.logger.warn(`BatFramework > Command ${name} does not extend CommandBase!`);
                    reject(true);
                    return;
                }
                if (!command.name) {
                    super.logger.warn(`BatFramework > Command ${name} doesn't have a name, and therefore cannot be used!`);
                    reject(true);
                    return;
                }
                const missing = [];
                if (!command.description) {
                    missing.push("Description");
                }
                if (!command.category) {
                    missing.push("Category");
                }
                if (missing.length > 0) {
                    super.logger.warn(`Command "${command.name}" is missing the following properties: ${missing.join(', ')}.`);
                }
                await command.setCommandFile(commandFile);
                this._commands.set(name, command);
                resolve(false);
                return;
            }
            catch (e) {
                super.logger.warn(`Command ${name} failed to load!`);
                super.logger.warn(`Stack Trace:`);
                super.logger.warn(`${e}`);
                reject(true);
                return;
            }
        });
    }
    async reloadCommands(instance) {
        for (let command of this._commands) {
            delete require.cache[require.resolve(command[1].commandFile)];
        }
        return await this.loadCommands(instance, instance.client, `${__dirname}${path_1.default.sep}Commands`, false, true);
    }
    async reloadCommand(instance, client, command) {
        return new Promise(async (reject, resolve) => {
            delete require.cache[require.resolve(command.commandFile)];
            const { name } = path_1.default.parse(command.commandFile);
            this._commands.delete(name);
            await this.registerCommand(instance, client, command.commandFile)
                .then(() => {
                super.log("Reloaded command " + command.name);
                resolve(false);
                return;
            });
            reject(false);
        });
    }
    get commands() {
        return this._commands;
    }
}
exports.default = CommandManager;
