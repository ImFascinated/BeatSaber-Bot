/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";

module.exports = class UnLinkCommand extends Command {
    constructor() {
        super("unlink", {
            category: "beatsaber",
            description: "Unlink your scoresaber account"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;

        if (userData.scoreSaberId == "") {
            await channel.send("You do not have a scoresaber account linked.");
            return;
        }
        userData.scoreSaberId = "";
        await channel.send("Successfully unlinked your scoresaber account.");
    }
}