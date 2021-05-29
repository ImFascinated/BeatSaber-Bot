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
            'Info',
            'Settings'
        ]

        let description =
            `
            Welcome to the help page of Beat Saber Bot.
            
            () required [] optional
            \n`
        ;

        categories.forEach(category => {
            description += `**${category} Commands** \n`
            this.instance!.commandManager.commands.forEach(cmd => {
                if (cmd.category == category.toLowerCase()) {
                    description += `${prefix}${cmd.name} ${cmd.usage == "" ? "" : cmd.usage + " "}- ${cmd.description}\n`
                }
            });
            description += `\n`;
        });

        await channel.send(new MessageEmbed()
            .setAuthor("Help")
            .setColor(`#${guildSettings.embedColor}`)
            .setDescription(description)
        );
    }
}