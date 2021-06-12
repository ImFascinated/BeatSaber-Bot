"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Command"));
module.exports = class ReloadCommand extends Command_1.default {
    constructor() {
        super("reload", {
            description: "Reload all or one of the commands",
            botOwnerOnly: true,
            category: "admin"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;
        const client = commandArguments.client;
        const args = commandArguments.args;
        if (args.length < 1) {
            const msg = await channel.send("Reloading commands...");
            await instance.commandManager.reloadCommands(instance)
                .then((err) => {
                if (err) {
                    msg.edit(`Failed to reload one or more commands\nPlease check console to see the error.`);
                    return;
                }
                msg.edit(`Reloaded all commands!`);
            });
        }
        else {
            const command = instance.commandManager.getCommandByName(args[0]);
            if (!command) {
                await channel.send("Unknown command!");
                return;
            }
            const msg = await channel.send(`Reloading ${command.name}...`);
            await instance.commandManager.reloadCommand(instance, client, command)
                .then(() => {
                msg.edit("Reloaded command `" + command.name + "`");
                console.log(1);
            })
                .catch((e) => {
                if (e == false) {
                    msg.edit("Reloaded command `" + command.name + "`");
                    return;
                }
                msg.edit("Failed to reload command `" + command.name + "`\nPlease check console to see the error.");
            });
        }
    }
};
