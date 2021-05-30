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
        const msg = await channel.send("Reloading commands..."), toReload = instance.commandManager.commands.size;
        const failedCommands = await instance.commandManager.reloadCommands(instance);
        let errors = ``;
        for (let failedCommand of failedCommands) {
            errors += `**__${failedCommand.name}__**\n${failedCommand.error}\n`;
        }
        await msg.edit(`Reloaded ${toReload - failedCommands.length}/${toReload} commands! ${errors !== `` ? "\n**Errors:**\n\n" + errors : ""}`);
    }
};
