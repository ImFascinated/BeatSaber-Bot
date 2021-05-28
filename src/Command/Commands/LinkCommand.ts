/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";

module.exports = class LinkCommand extends Command {
    constructor() {
        super("link", {});
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;

        if (userData.scoreSaberId !== "") {
            await channel.send("You already have a scoresaber account linked.");
            return;
        }
        let id = "";
        if (isNaN(Number.parseInt(args[0]))) {
            const match = args[1].match(/\d+/g);
            if (!match) {
                await channel.send("That is not a valid scoresaber link.");
                return;
            }
            id = match[0];
        } else {
            id = args[0];
        }
        userData.scoreSaberId = id;
        await channel.send("Successfully linked your scoresaber account.");
    }
}