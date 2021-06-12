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
        const client = commandArguments.client;
        const args = commandArguments.args;

        if (args.length < 1) {
            const msg = await channel.send("Reloading commands...");
            await instance.commandManager.reloadCommands(instance)
                .then((err) => {
                    if (err) {
                        msg.edit(`Failed to reload one or more commands\nPlease check console to see the error.`);
                        return;
                    }
                    msg.edit(`Reloaded all commands!`);
                });
        } else {
            const command = instance.commandManager.getCommandByName(args[0]);
            if (!command) {
                await channel.send("Unknown command!");
                return;
            }
            const msg = await channel.send(`Reloading ${command.name}...`);
            await instance.commandManager.reloadCommand(instance, client, command)
                .then(() => {
                    msg.edit("Reloaded command `" + command.name + "`");
                    console.log(1)
                })
                .catch((e) => {
                    if (e == false) {
                        msg.edit("Reloaded command `" + command.name + "`");
                        return;
                    }
                    msg.edit("Failed to reload command `" + command.name + "`\nPlease check console to see the error.");
                });
        }
    }
}