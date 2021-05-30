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
module.exports = class StatisticsCommand extends Command_1.default {
    constructor() {
        super("statistics", {
            description: "Statistics about the bot",
            aliases: [
                "botinfo",
                "stats"
            ],
            category: "info"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const client = commandArguments.client;
        const instance = commandArguments.instance;
        const guildSettings = commandArguments.guildSettings;
        let totalLinkedAccounts = 0;
        for (let value of instance.userDataManager.users.values()) {
            if (value.scoreSaberId !== "")
                totalLinkedAccounts++;
        }
        await channel.send(new discord_js_1.MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
            .setAuthor("Statistics")
            .setDescription(`
                **Bot Stats**
                Guild Count: **${client.guilds.cache.size}**
                Total Users: **${client.users.cache.size}**
                Uptime: **${instance.utils.formatTime(process.uptime() * 1000)}**
                
                **Beat Saber Stats**
                Total Accounts: **${instance.userDataManager.users.size}**
                Total Linked Accounts: **${totalLinkedAccounts}**
                `));
    }
};
