/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import moment from "moment";
import Discord, {Channel, DMChannel, MessageEmbed, NewsChannel, TextChannel} from "discord.js";
import {MapInfo} from "../../BeatSaber/BeatSaver/MapInfo";
import {IRestResponse} from "typed-rest-client/restClient";
import Guild from "../../Guilds/Guild";
import UserData from "../../Data/UserData";

module.exports = class RecentSongCommand extends Command {
    constructor() {
        super("recentsong", {
            category: "beatsaber",
            description: "Check out your most recent play",
            usage: "[user] [offset]"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        const guildSettings = commandArguments.guildSettings;
        const message = commandArguments.message;

        if (args.length <= 0) {
            if (userData.scoreSaberId == "") {
                await channel.send("You have not linked your scoresaber account.");
                return;
            }

            await this.sendScoreMessage(userData, channel, guildSettings);
            return;
        } else if (args[0].length == 18) {
            const target = message.mentions.members?.first() || message.guild?.members.cache.get(args[0]);
            if (target == null) {
                await channel.send("Unknown or invalid user.");
                return;
            }
            const targetData = super.instance.userDataManager.getUserData(target.id);
            if (targetData == null)
                return;
            if (targetData.scoreSaberId == "") {
                await channel.send(`<@${target.id}> has not linked their scoresaber account.`);
                return;
            }

            if (args.length == 1) {
                await this.sendScoreMessage(targetData, channel, guildSettings);
                return;
            } else if (args.length == 2) {
                await this.sendScoreMessage(targetData, channel, guildSettings, Number.parseInt(args[1]));
                return;
            }
        } else {
            if (userData.scoreSaberId == "") {
                await channel.send("You have not linked your scoresaber account.");
                return;
            }

            await this.sendScoreMessage(userData, channel, guildSettings, Number.parseInt(args[0]));
            return;
        }
    }

    private async sendScoreMessage(user: UserData, channel: TextChannel | DMChannel | NewsChannel, guildSettings: Guild, offsetArg?: number) {
        const recentSongs = await super.instance.beatSaberManager.fetchScores(user.scoreSaberId, "RECENT", 0);
        const player = await super.instance.beatSaberManager.getPlayer(user.scoreSaberId);
        if (recentSongs == null || player == null) {
            await channel.send("Unable to fetch recent song...");
            return;
        }
        let song = recentSongs[0];
        if (offsetArg) {
            if (isNaN(offsetArg)) {
                await channel.send("That is not a valid number qwq");
                return;
            }
            if (offsetArg < 0) {
                await channel.send("That is not a valid offset qwq");
                return;
            }
            song = recentSongs[offsetArg-1];
        } else {
            song = recentSongs[0];
        }

        const response: IRestResponse<MapInfo> = await super.instance.beatSaberManager.restClientBeatSaver.get<MapInfo>(`maps/by-hash/${song.songHash}`);
        if (response.result === null) {
            console.log(`Failed to fetch map data for song hash ${song.songHash} (status=${response.statusCode})`);
        }

        const banner: Buffer = await super.instance.beatSaberManager.createSongBanner(song);
        const bannerAttachment = new Discord.MessageAttachment(banner, 'banner.png');
        await channel.send(new MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setTimestamp()
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