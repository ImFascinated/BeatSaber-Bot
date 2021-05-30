/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import Discord, {MessageEmbed} from "discord.js";

module.exports = class HistoryCommand extends Command {
    constructor() {
        super("history", {
            category: "beatsaber",
            description: "Shows you your previous rank over 50 days"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        const instance = commandArguments.instance;

        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }

        const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
        if (!player)
            return;

        const rankHistoryImage = await instance.beatSaberManager.createRankHistory(player);
        const historyAttachment = new Discord.MessageAttachment(rankHistoryImage, 'history.png');
        await channel.send(historyAttachment);
    }
}