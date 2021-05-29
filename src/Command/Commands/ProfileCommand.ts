/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import Discord from "discord.js";

module.exports = class RecentSongsCommand extends Command {
    constructor() {
        super("profile", {
            category: "beatsaber",
            description: "Check your score saber profile"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;

        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }

        const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
        if (player == null) {
            await channel.send("Unable to fetch your score saber profile...");
            return;
        }
        const header: Buffer = await super.instance.beatSaberManager.createProfileImage(player);
        const headerAttachment = new Discord.MessageAttachment(header, 'profile.png');
        await channel.send(headerAttachment);
    }
}