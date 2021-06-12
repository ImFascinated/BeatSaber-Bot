"use strict";
/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 25/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Command"));
const discord_js_1 = require("discord.js");
module.exports = class HelpCommand extends Command_1.default {
    constructor() {
        super("help", {
            description: "Main entry point",
            category: "general"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const guildSettings = commandArguments.guildSettings;
        const prefix = guildSettings.prefix;
        const categories = [
            'BeatSaber',
            'General',
            'Info',
            'Settings'
        ];
        let description = `
            Welcome to the help page of Beat Saber Bot.
            \`() required [] optional\`
            \n`;
        categories.forEach(category => {
            description += `**${category}** \n`;
            this.instance.commandManager.commands.forEach(cmd => {
                if (cmd.category == category.toLowerCase()) {
                    description += `• \`${prefix}${cmd.name}${cmd.usage == "" ? "\`" : " " + cmd.usage + "\` "} - ${cmd.description}\n`;
                }
            });
            description += `\n`;
        });
        description += `:beginner: [**[Add me to your server]**](https://discord.com/oauth2/authorize?client_id=847958793468117032&permissions=8&scope=bot)\n\n`;
        description += `:tools: [**[GitHub]**](https://github.com/ImFascinated/BeatSaber-Bot)`;
        await channel.send(new discord_js_1.MessageEmbed()
            .setAuthor("Help")
            .setColor(`#${guildSettings.embedColor}`)
            .setDescription(description)
            .setFooter(super.instance.embedFooter)
            .setTimestamp());
    }
};
