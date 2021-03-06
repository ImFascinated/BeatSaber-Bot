/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import Discord from "discord.js";

module.exports = class TopSongsCommand extends Command {
    constructor() {
        super("topsongs", {
            category: "beatsaber",
            description: "Check out your 6 best plays",
            usage: '<page>'
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        const args = commandArguments.args;

        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }

        if (args.length < 1) {
            const topSongs = await super.instance.beatSaberManager.fetchScores(userData.scoreSaberId, "TOP", 1);
            const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
            if (topSongs == null || player == null) {
                await channel.send("Unable to fetch top songs...");
                return;
            }
            const header: Buffer = await super.instance.beatSaberManager.createHeader(player, "TOP SONGS");
            const headerAttachment = new Discord.MessageAttachment(header, 'header.png');
            await channel.send(headerAttachment);

            const topSongsImage: Buffer | undefined = await super.instance.beatSaberManager.createSongsImage(player, "TOP");
            if (topSongsImage == undefined) {
                return;
            }
            const songsAttachment = new Discord.MessageAttachment(topSongsImage, 'songs.png');
            await channel.send(songsAttachment);
        } else {
            const page = Number.parseInt(args[0]);
            if (isNaN(page)) {
                await channel.send("That is not a valid page number");
                return;
            }

            const topSongs = await super.instance.beatSaberManager.fetchScores(userData.scoreSaberId, "TOP", 1);
            const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
            if (topSongs == null || player == null) {
                await channel.send("Unable to fetch top songs...");
                return;
            }
            const header: Buffer = await super.instance.beatSaberManager.createHeader(player, "TOP SONGS", page);
            const headerAttachment = new Discord.MessageAttachment(header, 'header.png');
            await channel.send(headerAttachment);

            const topSongsImage: Buffer | undefined = await super.instance.beatSaberManager.createSongsImage(player, "TOP", page);
            if (topSongsImage == undefined) {
                return;
            }
            const songsAttachment = new Discord.MessageAttachment(topSongsImage, 'songs.png');
            await channel.send(songsAttachment);
            await channel.send(`**TIP:** This only shows the top 6 results from a page!`)
        }
    }
}