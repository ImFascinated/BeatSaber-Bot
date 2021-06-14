/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";
import {MessageEmbed} from "discord.js";
import * as fs from "fs";
import path from "path";
import util from "util";
import os from "os-utils";

const usage = require('cpu-percentage');
const readDir = util.promisify(fs.readdir);

module.exports = class StatisticsCommand extends Command {
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

    async execute(commandArguments: ICommandArguments): Promise<void> {
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
                `

        if (message.author.id == "510639833811517460") {
            const artDir = await readDir(path.resolve(__dirname, `../../../../resources/images/song-art/`));

            let totalSize = 0
            artDir.forEach(function(filePath) {
                totalSize += fs.statSync(path.resolve(__dirname, `../../../../resources/images/song-art/`) + "/" + filePath).size
            })

            const cpuUsageSystem: number = await new Promise(resolve => os.cpuUsage(resolve));
            const cpuUsageNode: number = usage().percent / os.cpuCount();

            description +=
                `Song Art Saved: **${artDir.length} (${instance.utils.convertBytes(totalSize)})**
                
                **System Stats**
                CPU Usage: **${(100 * cpuUsageSystem).toFixed(2)}%**
                Memory Usage: **${instance.utils.convertBytes((os.totalmem()*1024*1024) - (os.freemem()*1024*1024))}**/**${instance.utils.convertBytes(os.totalmem()*1024*1024)}**
                
                **Node Stats**
                CPU Usage: **${cpuUsageNode.toFixed(2)}%**
                Memory Usage: **${instance.utils.convertBytes(process.memoryUsage().heapUsed)}**/**${instance.utils.convertBytes(process.memoryUsage().heapTotal)}**
                `
        }

        await channel.send(new MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
            .setAuthor("Statistics")
            .setDescription(description)
        );
    }
}