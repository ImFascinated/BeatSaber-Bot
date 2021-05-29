/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import Discord from "discord.js";

module.exports = class CompareCommand extends Command {
    constructor() {
        super("compare", {
            category: "beatsaber",
            description: "Compare two people together",
            usage: "(player1) (player2)"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const message = commandArguments.message;

        const target1 = message.mentions.members?.first(1)[0] || message.guild?.members.cache.get(args[0]);
        if (target1 == null) {
            await channel.send("First target is unknown or invalid.");
            return;
        }
        const target1UserData = super.instance.userDataManager.getUserData(target1.id);
        if (target1UserData == undefined) return;
        if (target1UserData.scoreSaberId == "") {
            await channel.send(`<@${target1.id}> has not linked their scoresaber account.`);
            return;
        }
        const target1Player = await super.instance.beatSaberManager.getPlayer(target1UserData.scoreSaberId);
        if (target1Player == null) {
            await channel.send(`Unable to fetch profile for <@${target1.id}>...`);
            return;
        }

        const target2 = message.mentions.members?.first(2)[1] || message.guild?.members.cache.get(args[1]);
        if (target2 == null) {
            await channel.send("Second target is unknown or invalid.");
            return;
        }
        const target2UserData = super.instance.userDataManager.getUserData(target2.id);
        if (target2UserData == undefined) return;
        if (target2UserData?.scoreSaberId == "") {
            await channel.send(`<@${target2.id}> has not linked their scoresaber account.`);
            return;
        }
        const target2Player = await super.instance.beatSaberManager.getPlayer(target2UserData.scoreSaberId);
        if (target2Player == null) {
            await channel.send(`Unable to fetch profile for <@${target2.id}>...`);
            return;
        }

        const header: Buffer | undefined = await super.instance.beatSaberManager.createComparisonHeaderImage(target1Player, target2Player);
        if (header == undefined) {
            return;
        }
        const headerImage = new Discord.MessageAttachment(header, 'header.png');
        await channel.send(headerImage);
        const comparisonImage: Buffer | undefined = await super.instance.beatSaberManager.createComparisonImage(target1Player, target2Player);
        if (comparisonImage == undefined) {
            return;
        }
        const songsAttachment = new Discord.MessageAttachment(comparisonImage, 'comparison.png');
        await channel.send(songsAttachment);
    }
}