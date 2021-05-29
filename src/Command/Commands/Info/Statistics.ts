/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";
import {MessageEmbed} from "discord.js";

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

        let totalLinkedAccounts = 0;
        for (let value of instance.userDataManager.users.values()) {
            if (value.scoreSaberId !== "")
                totalLinkedAccounts++;
        }

        await channel.send(new MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
            .setAuthor("Statistics")
            .setDescription(
                `
                **Bot Stats**
                Guild Count: ${client.guilds.cache.size}
                Total Users: ${client.users.cache.size}
                
                **Beat Saber Stats**
                Total Accounts: ${instance.userDataManager.users.size}
                Total Linked Accounts: ${totalLinkedAccounts}
                `
            )
        );
    }
}