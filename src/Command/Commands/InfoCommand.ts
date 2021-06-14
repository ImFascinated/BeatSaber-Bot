/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 12/06/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";

module.exports = class InfoCommand extends Command {
    constructor() {
        super("info", {
            category: "beatsaber",
            description: "Information about you [NOT MADE YET <33]"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;

        await channel.send("Not currently made :3")
    }
}