/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import moment from "moment";
import Discord, {MessageEmbed} from "discord.js";
import {MapInfo} from "../../Beat Saber/BeatSaver/MapInfo";
import {IRestResponse} from "typed-rest-client/restClient";

module.exports = class RecentSongCommand extends Command {
    constructor() {
        super("recentsong", {});
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;

        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }

        const recentSongs = await super.instance.beatSaberManager.fetchScores(userData.scoreSaberId, "RECENT", 1);
        const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
        if (recentSongs == null || player == null) {
            await channel.send("Unable to fetch recent song...");
            return;
        }
        let song = recentSongs[0];
        if (args.length > 1) {
            const offset = Number.parseInt(args[1]);
            if (isNaN(offset)) {
                await channel.send("That is not a valid number qwq");
                return;
            }
            if (offset < 0) {
                await channel.send("That is not a valid offset qwq");
                return;
            }
            song = recentSongs[offset-1];
        }

        const response: IRestResponse<MapInfo> = await super.instance.beatSaberManager.restClientBeatSaver.get<MapInfo>(`maps/by-hash/${song.songHash}`);
        if (response.result === null) {
            console.log(`Failed to fetch map data for song hash ${song.songHash} (status=${response.statusCode})`);
        }

        const banner: Buffer = await super.instance.beatSaberManager.createSongBanner(player, song);
        const bannerAttachment = new Discord.MessageAttachment(banner, 'banner.png');
        await channel.send(new MessageEmbed()
            .setAuthor(
                player.playerInfo.playerName,
                `https://new.scoresaber.com/api/static/avatars/${player.playerInfo.playerId}.jpg`,
                `https://scoresaber.com/u/${player.playerInfo.playerId}`
            )
            .setTitle(song.songAuthorName + " - " + song.songName)
            .setDescription(`${song.difficultyRaw.replaceAll("_", "").replaceAll("SoloStandard", "").replaceAll("ExpertPlus", "Expert Plus")}\n[Download Map](https://beatsaver.com${response.result!.directDownload}) - [Preview Map](https://skystudioapps.com/bs-viewer/?id=${response.result!.key})`)
            .attachFiles(bannerAttachment /* Ignore Error */)
            .setImage('attachment://banner.png')
            .setFooter("Time Set: " + moment(new Date(song.timeSet)).format('MMMM Do YYYY, h:mm:ss a'))
        );
    }
}