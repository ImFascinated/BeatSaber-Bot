/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 25/05/2021
 */
import BSBotClient from "../Client/BSBotClient";
import Manager from "../Utils/Manager";
import Command from "./Command";
import path from "path";
import {promisify} from 'util';
import {Client, Message, MessageEmbed} from "discord.js";
import Guild from "../Guilds/Guild";
import UserData from "../UserData/UserData";

const glob = promisify(require('glob'));

export default class CommandManager extends Manager {

    private _commands: Map<String, Command> = new Map();
    
    constructor(instance: BSBotClient) {
        super(instance);

        this.loadCommands(instance, instance.client, `${__dirname}${path.sep}Commands`, false);

        instance.client.on("message", async (message: Message) => {
            const { guild, member, author, content, channel } = message
            if (!guild || author.bot) return;
            if (!member) return;

            let guildData: Guild | undefined = instance.guildManager.getGuild(guild.id);
            if (guildData === undefined) {
                await instance.guildManager.createGuild(guild.id);
                guildData = instance.guildManager.getGuild(guild.id);
            }

            let userData: UserData | undefined = instance.userDataManager.getUserData(author.id);
            if (userData === undefined) {
                await instance.userDataManager.createUserData(author.id);
                userData = instance.userDataManager.getUserData(author.id);
            }

            if (guildData === undefined) return;
            if (userData === undefined) return;
            const prefix = guildData.prefix;
            if (prefix === undefined) return;
            if (!content.toLowerCase().startsWith(prefix.toLowerCase())) return;

            const [cmd, ...args] = content.slice(prefix.length).trim().split(/ +/g);
            const command: Command | undefined = this.getCommandByName(cmd);
            if (command) {
                if (command.botOwnerOnly) {
                    if (member.id !== "510639833811517460") {
                        return (await channel.send(
                            `You do not own me and cannot use this command.\n*This message will be automatically deleted in 5 seconds.*`
                        )).delete({ timeout: 5000 })
                    }
                }

                if (command.permissions.length > 0) {
                    if (member.id !== "510639833811517460") {
                        const missingPermissions: string[] = [];
                        command.permissions.forEach(permission => {
                            if (!member?.hasPermission(permission)) {
                                missingPermissions.push(permission);
                            }
                        })
                        if (missingPermissions.length !== 0) {
                            return (await channel.send(
                                `You are missing the permission${missingPermissions.length > 1 ? 's' : ''} \`${missingPermissions.join(', ')}\` and cannot use this command.\n*This message will be automatically deleted in 5 seconds.*`
                            )).delete({ timeout: 5000 })
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
                    channel.send(new MessageEmbed()
                        .setAuthor("Command Execution Error")
                        .setColor("RED")
                        .setDescription("help, i have mc fallen qwq <:winky:848021877942124584>\nIf this is an actual issue, please message Fascinated#4735\n\n**Error:**\n" + err)
                    );

                    super.logger.log(`Command ${command.name} has failed to execute.`);
                    super.logger.log(err);
                    super.logger.log(err.stack);
                });
            }
        });
    }

    public async loadCommands(instance: BSBotClient, client: Client, directory: string | undefined, silentLoad?: boolean, reload?: boolean) {
        if (directory === undefined) return [];

        return glob(`${directory}${path.sep}**${path.sep}*.js`).then(async (commands: any[]) => {
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

    public getCommandByName(name: string): Command | undefined {
        let toReturn: Command | undefined = undefined;
        this._commands.forEach(command => {
            if (toReturn) return toReturn;
            if (command.name === name) toReturn = command;
            if (command.aliases) {
                command.aliases.forEach(alias => {
                    if (alias === name) toReturn = command;
                });
            }
        });
        return toReturn;
    }

    public async registerCommand(instance: BSBotClient, client: Client, commandFile: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            const { name } = path.parse(commandFile);
            try {
                delete require.cache[commandFile];
                let File = await require(commandFile);
                if (!instance.utils.isClass(File)) {
                    super.logger.warn(`BatFramework > Command ${name} doesn't export a class!`);
                    reject(true);
                    return;
                }
                const command = await new File(client, name.toLowerCase());
                if (!(await command instanceof Command)) {
                    super.logger.warn(`BatFramework > Command ${name} does not extend CommandBase!`);
                    reject(true);
                    return;
                }

                if (!command.name) {
                    super.logger.warn(`BatFramework > Command ${name} doesn't have a name, and therefore cannot be used!`)
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
                    super.logger.warn(`Command "${command.name}" is missing the following properties: ${missing.join(', ')}.`)
                }

                await command.setCommandFile(commandFile);
                this._commands.set(name, command);
                resolve(false);
                return;
            } catch(e) {
                super.logger.warn(`Command ${name} failed to load!`);
                super.logger.warn(`Stack Trace:`);
                super.logger.warn(`${e}`);
                reject(true);
                return;
            }
        })
    }

    public async reloadCommands(instance: BSBotClient): Promise<boolean> {
        for (let command of this._commands) {
            delete require.cache[require.resolve(command[1].commandFile)];
        }

        return await this.loadCommands(instance, instance.client, `${__dirname}${path.sep}Commands`, false, true);
    }

    public async reloadCommand(instance: BSBotClient, client: Client, command: Command): Promise<boolean> {
        return new Promise(async (reject, resolve) => {
            delete require.cache[require.resolve(command.commandFile)];
            const {name} = path.parse(command.commandFile);
            this._commands.delete(name);
            await this.registerCommand(instance, client, command.commandFile)
                .then(() => {
                    super.log("Reloaded command " + command.name);
                    resolve(false);
                    return;
                })
            reject(false);
        });
    }

    get commands(): Map<String, Command> {
        return this._commands;
    }
}