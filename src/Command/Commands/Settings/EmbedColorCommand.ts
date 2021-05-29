/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";

module.exports = class EmbedColorCommand extends Command {
    constructor() {
        super("embedcolor", {
            description: "Set the embed color",
            category: "settings",
            aliases: [
                "setprefix"
            ],
            permissions: [
                "ADMINISTRATOR"
            ]
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const guildSettings = commandArguments.guildSettings;

        if (args.length < 1) {
            await channel.send(`The current color is \`${guildSettings.embedColor}\``);
            return;
        }

        guildSettings.embedColor = args[0];
        await channel.send(`The guilds embed color has been updated to \`${args[0]}\``);
    }
}