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

        await channel.send(new MessageEmbed()
            .setAuthor("Beat Saber - Commands")
            .setColor("YELLOW")
            .setDescription(
                `
                ${prefix}link <scoresaber url> 
                ${prefix}unlink 
                ${prefix}topsongs 
                ${prefix}recentsongs 
                ${prefix}topsong (offset)
                ${prefix}recentsong (offset)
                ${prefix}compare (user1) (user2) 
                
                ${prefix}help
                ${prefix}ping
                ${prefix}prefix (new prefix)
                `
            )
        );
    }
}