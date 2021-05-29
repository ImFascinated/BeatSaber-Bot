/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";
import {MessageEmbed} from "discord.js";

module.exports = class TopGuildsCommand extends Command {
    constructor() {
        super("topguilds", {
            description: "Shows the top 10 biggest guilds",
            botOwnerOnly: true,
            category: "admin"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const client = commandArguments.instance.client;
        const guildSettings = commandArguments.guildSettings;

        const sortedGuilds = client.guilds.cache.sort((a, b) => b.members.cache.size - a.members.cache.size).array();

        let description = '';
        for (let i = 0; i < (sortedGuilds.length <= 10 ? sortedGuilds.length : 10); i++) {
            const guild = sortedGuilds[i];

            description += `${guild.members.cache.size} - ${guild.name}\n`;
        }
        await channel.send(new MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
            .setAuthor(`Top 10 Guilds [Admin Only]`)
            .setDescription(description)
        );
    }
}