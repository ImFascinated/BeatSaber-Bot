/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";

module.exports = class UptimeCommand extends Command {
    constructor() {
        super("uptime", {
            description: "Shows the bots uptime",
            category: "info"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;

        await channel.send(`Uptime: **${instance.utils.formatTime(process.uptime() * 1000)}**`)
    }
}