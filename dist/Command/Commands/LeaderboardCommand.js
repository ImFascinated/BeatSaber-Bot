"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../Command"));
const discord_js_1 = require("discord.js");
module.exports = class LeaderboardCommand extends Command_1.default {
    constructor() {
        super("leaderboard", {
            category: "beatsaber",
            description: "Shows you the top 15 people in the global leaderboard"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;
        const guildSettings = commandArguments.guildSettings;
        const players = await instance.beatSaberManager.fetchLeaderboard();
        let description = ``;
        for (let i = 0; i < 15; i++) {
            const player = players[i];
            description += `\`#${player.rank}\`. **${player.playerName}** | PP: **${player.pp}** | Country: **${player.country}** :flag_${player.country.toLowerCase()}:\n`;
        }
        await channel.send(new discord_js_1.MessageEmbed()
            .setAuthor("Top 15 Global Leaderboard")
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setDescription(description)
            .setTimestamp());
    }
};
