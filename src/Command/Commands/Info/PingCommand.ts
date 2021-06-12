/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 26/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";

module.exports = class PingCommand extends Command {
    constructor() {
        super("ping", {
            description: "Retrieves the response time of the bot",
            category: "info"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;

        const before = Date.now();
        const msg = await channel.send("Pinging...");
        await msg.edit(`Ping! \`${Date.now() - before}ms\``);
    }
}