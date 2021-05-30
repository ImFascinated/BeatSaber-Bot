"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../Command"));
const moment_1 = __importDefault(require("moment"));
const discord_js_1 = __importStar(require("discord.js"));
module.exports = class RecentSongCommand extends Command_1.default {
    constructor() {
        super("recentsong", {
            category: "beatsaber",
            description: "Check out your most recent play",
            usage: "[user] [offset]"
        });
    }
    async execute(commandArguments) {
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
        }
        else if (args[0].length == 18) {
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
            }
            else if (args.length == 2) {
                await this.sendScoreMessage(targetData, channel, guildSettings, Number.parseInt(args[1]));
                return;
            }
        }
        else {
            if (userData.scoreSaberId == "") {
                await channel.send("You have not linked your scoresaber account.");
                return;
            }
            await this.sendScoreMessage(userData, channel, guildSettings, Number.parseInt(args[0]));
            return;
        }
    }
    async sendScoreMessage(user, channel, guildSettings, offsetArg) {
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
            song = recentSongs[offsetArg - 1];
        }
        else {
            song = recentSongs[0];
        }
        const response = await super.instance.beatSaberManager.restClientBeatSaver.get(`maps/by-hash/${song.songHash}`);
        if (response.result === null) {
            console.log(`Failed to fetch map data for song hash ${song.songHash} (status=${response.statusCode})`);
        }
        const banner = await super.instance.beatSaberManager.createSongBanner(song);
        const bannerAttachment = new discord_js_1.default.MessageAttachment(banner, 'banner.png');
        await channel.send(new discord_js_1.MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setTimestamp()
            .setAuthor(player.playerInfo.playerName, `https://new.scoresaber.com/api/static/avatars/${player.playerInfo.playerId}.jpg`, `https://scoresaber.com/u/${player.playerInfo.playerId}`)
            .setTitle(song.songAuthorName + " - " + song.songName)
            .setDescription(`${song.difficultyRaw.replaceAll("_", "").replaceAll("SoloStandard", "").replaceAll("ExpertPlus", "Expert Plus")}\n[Download Map](https://beatsaver.com${response.result.directDownload}) - [Preview Map](https://skystudioapps.com/bs-viewer/?id=${response.result.key})`)
            .attachFiles(bannerAttachment /* Ignore Error */)
            .setImage('attachment://banner.png')
            .setFooter("Time Set: " + moment_1.default(new Date(song.timeSet)).format('MMMM Do YYYY, h:mm:ss a')));
    }
};
