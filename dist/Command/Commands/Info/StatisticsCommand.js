"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Command"));
const discord_js_1 = require("discord.js");
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const os_utils_1 = __importDefault(require("os-utils"));
const usage = require('cpu-percentage');
const readDir = util_1.default.promisify(fs.readdir);
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
        const message = commandArguments.message;
        let totalLinkedAccounts = 0;
        for (let value of instance.userDataManager.users.values()) {
            if (value.scoreSaberId !== "")
                totalLinkedAccounts++;
        }
        let description = `
                **Bot Stats**
                Guild Count: **${client.guilds.cache.size}**
                Total Users: **${client.users.cache.size}**
                Uptime: **${instance.utils.formatTime(process.uptime() * 1000)}**
                
                **Beat Saber Stats**
                Total Accounts: **${instance.userDataManager.users.size}**
                Total Linked Accounts: **${totalLinkedAccounts}**
                `;
        if (message.author.id == "510639833811517460") {
            const artDir = await readDir(path_1.default.resolve(__dirname, `../../../../resources/images/song-art/`));
            let totalSize = 0;
            artDir.forEach(function (filePath) {
                totalSize += fs.statSync(path_1.default.resolve(__dirname, `../../../../resources/images/song-art/`) + "/" + filePath).size;
            });
            const cpuUsageSystem = await new Promise(resolve => os_utils_1.default.cpuUsage(resolve));
            const cpuUsageNode = usage().percent / os_utils_1.default.cpuCount();
            description +=
                `Song Art Saved: **${artDir.length} (${instance.utils.convertBytes(totalSize)})**
                
                **System Stats**
                CPU Usage: **${(100 * cpuUsageSystem).toFixed(2)}%**
                Memory Usage: **${instance.utils.convertBytes((os_utils_1.default.totalmem() * 1024 * 1024) - (os_utils_1.default.freemem() * 1024 * 1024))}**/**${instance.utils.convertBytes(os_utils_1.default.totalmem() * 1024 * 1024)}**
                
                **Node Stats**
                CPU Usage: **${cpuUsageNode.toFixed(2)}%**
                Memory Usage: **${instance.utils.convertBytes(process.memoryUsage().heapUsed)}**/**${instance.utils.convertBytes(process.memoryUsage().heapTotal)}**
                `;
        }
        await channel.send(new discord_js_1.MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
            .setAuthor("Statistics")
            .setDescription(description));
    }
};
