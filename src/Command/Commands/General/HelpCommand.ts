/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 25/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";
import {MessageEmbed} from "discord.js";

module.exports = class HelpCommand extends Command {
    constructor() {
        super("help", {
            description: "Main entry point",
            category: "general"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;

        const guildSettings = commandArguments.guildSettings;
        const prefix = guildSettings.prefix;

        const categories = [
            'BeatSaber',
            'General',
            'Info',
            'Settings'
        ]

        let description =
            `
            Welcome to the help page of Beat Saber Bot.
            \`() required [] optional\`
            \n`
        ;

        categories.forEach(category => {
            description += `**${category}** \n`
            this.instance!.commandManager.commands.forEach(cmd => {
                if (cmd.category == category.toLowerCase()) {
                    description += `• \`${prefix}${cmd.name}${cmd.usage == "" ? "\`" : " " + cmd.usage + "\` "} - ${cmd.description}\n`
                }
            });
            description += `\n`;
        });

        description += `:beginner: [**[Add me to your server]**](https://discord.com/oauth2/authorize?client_id=847958793468117032&permissions=8&scope=bot)\n\n`
        description += `:tools: [**[GitHub]**](https://github.com/ImFascinated/BeatSaber-Bot)`

        await channel.send(new MessageEmbed()
            .setAuthor("Help")
            .setColor(`#${guildSettings.embedColor}`)
            .setDescription(description)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
        );
    }
}