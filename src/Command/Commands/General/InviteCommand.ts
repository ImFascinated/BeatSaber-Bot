/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";
import {MessageEmbed} from "discord.js";

module.exports = class InviteCommand extends Command {
    constructor() {
        super("invite", {
            description: "Sends the bots invite",
            category: "general"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const guildSettings = commandArguments.guildSettings;

        await channel.send(new MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setFooter(super.instance.embedFooter)
            .setAuthor("Beat Saber Bot Invite")
            .setDescription("[BS Bot Invite](https://discord.com/oauth2/authorize?client_id=847958793468117032&permissions=8&scope=bot)")
        );
    }
}