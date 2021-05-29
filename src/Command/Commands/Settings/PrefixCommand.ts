/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";

module.exports = class PrefixCommand extends Command {
    constructor() {
        super("prefix", {
            description: "Set the guilds prefix",
            category: "settings",
            aliases: [
                "setprefix"
            ],
            permissions: [
                "ADMINISTRATOR"
            ],
            commandTips: [
                "You can check the current prefix with **%prefix%prefix**"
            ]
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const guildSettings = commandArguments.guildSettings;

        if (args.length < 1) {
            await channel.send(`The current prefix is \`${guildSettings.prefix}\``);
            return;
        }

        let prefix = args.join(" ");
        if (prefix.includes(`\"`)) {
            prefix = prefix.replaceAll(/["]/g, "");
        } else {
            prefix = prefix[0];
        }

        if (prefix.length > 10) {
            await channel.send(`Your prefix cannot be more than 10 characters long.\n${super.getRandomCommandTip()}`);
            return;
        }
        if (prefix.length < 1) {
            await channel.send(`Your prefix cannot be less than 1 character long.\n${super.getRandomCommandTip()}`);
            return;
        }

        guildSettings.prefix = prefix;
        await channel.send(`The guilds prefix has been updated to \`${prefix}\`\n${super.getRandomCommandTip()}`);
    }
}