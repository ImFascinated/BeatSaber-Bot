/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";

module.exports = class SetupScoreFeedCommand extends Command {
    constructor() {
        super("setupscorefeed", {
            description: "Setup the score feed for your scores",
            botOwnerOnly: true,
            category: "admin"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;

        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }

        userData.scoreFeedChannelId = args[0];
        await channel.send("set chnl")

        const recentSongs = await super.instance.beatSaberManager.fetchScores(userData.scoreSaberId, "RECENT", 1);
        if (recentSongs) {
            const mostRecentPlay = recentSongs[0];

            if (userData.lastScore.scoreId == -1) {
                userData.lastScore = {
                    scoreId: mostRecentPlay.scoreId
                }
            }

            await channel.send("set most recent score in file")
        }
    }
}