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
const discord_js_1 = require("discord.js");
module.exports = class TopGuildsCommand extends Command_1.default {
    constructor() {
        super("topguilds", {
            description: "Shows the top 10 biggest guilds",
            botOwnerOnly: true,
            category: "admin"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const client = commandArguments.instance.client;
        const guildSettings = commandArguments.guildSettings;
        const sortedGuilds = client.guilds.cache.sort((a, b) => b.members.cache.size - a.members.cache.size).array();
        let description = '';
        for (let i = 0; i < (sortedGuilds.length <= 10 ? sortedGuilds.length : 10); i++) {
            const guild = sortedGuilds[i];
            description += `${guild.members.cache.size} - ${guild.name}\n`;
        }
        await channel.send(new discord_js_1.MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
            .setAuthor(`Top 10 Guilds [Admin Only]`)
            .setDescription(description));
    }
};
