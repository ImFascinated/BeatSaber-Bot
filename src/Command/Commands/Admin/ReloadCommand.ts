/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";
import {MessageEmbed} from "discord.js";

module.exports = class ReloadCommand extends Command {
    constructor() {
        super("reload", {
            description: "Reload all or one of the commands",
            botOwnerOnly: true,
            category: "admin"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;

        const msg = await channel.send("Reloading commands..."), toReload = instance.commandManager.commands.size;
        const failedCommands = await instance.commandManager.reloadCommands(instance);

        let errors = ``;
        for (let failedCommand of failedCommands) {
            errors += `**__${failedCommand.name}__**\n${failedCommand.error}\n`
        }
        await msg.edit(`Reloaded ${toReload-failedCommands.length}/${toReload} commands! ${errors !== `` ? "\n**Errors:**\n\n" + errors : ""}`);
    }
}