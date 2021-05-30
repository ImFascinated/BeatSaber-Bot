"use strict";
/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Command"));
module.exports = class EmbedColorCommand extends Command_1.default {
    constructor() {
        super("embedcolor", {
            description: "Set the embed color",
            category: "settings",
            aliases: [
                "setprefix"
            ],
            permissions: [
                "ADMINISTRATOR"
            ]
        });
    }
    async execute(commandArguments) {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const guildSettings = commandArguments.guildSettings;
        if (args.length < 1) {
            await channel.send(`The current color is \`${guildSettings.embedColor}\``);
            return;
        }
        guildSettings.embedColor = args[0];
        await channel.send(`The guilds embed color has been updated to \`${args[0]}\``);
    }
};
