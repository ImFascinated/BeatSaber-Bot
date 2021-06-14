/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import Discord from "discord.js";

module.exports = class RecentSongsCommand extends Command {
    constructor() {
        super("recentsongs", {
            category: "beatsaber",
            description: "Check your 6 most recent plays",
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
            const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
            if (player == null) {
                await channel.send("Unable to fetch recent songs...");
                return;
            }
            const header: Buffer = await super.instance.beatSaberManager.createHeader(player, "RECENT SONGS");
            const headerAttachment = new Discord.MessageAttachment(header, 'header.png');
            await channel.send(headerAttachment);

            const recentSongsImage: Buffer | undefined = await super.instance.beatSaberManager.createSongsImage(player, "RECENT");
            if (recentSongsImage == undefined) {
                return;
            }
            const songsAttachment = new Discord.MessageAttachment(recentSongsImage, 'songs.png');
            await channel.send(songsAttachment);
        } else {
            const page = Number.parseInt(args[0]);
            if (isNaN(page)) {
                await channel.send("That is not a valid page number");
                return;
            }

            const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
            if (player == null) {
                await channel.send("Unable to fetch recent songs...");
                return;
            }
            const header: Buffer = await super.instance.beatSaberManager.createHeader(player, "RECENT SONGS", page);
            const headerAttachment = new Discord.MessageAttachment(header, 'header.png');
            await channel.send(headerAttachment);

            const recentSongsImage: Buffer | undefined = await super.instance.beatSaberManager.createSongsImage(player, "RECENT", page);
            if (recentSongsImage == undefined) {
                return;
            }
            const songsAttachment = new Discord.MessageAttachment(recentSongsImage, 'songs.png');
            await channel.send(songsAttachment);
            await channel.send(`**TIP:** This only shows the top 6 results from a page!`)
        }
    }
}