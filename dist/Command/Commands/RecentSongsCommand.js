"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../Command"));
const discord_js_1 = __importDefault(require("discord.js"));
module.exports = class RecentSongsCommand extends Command_1.default {
    constructor() {
        super("recentsongs", {
            category: "beatsaber",
            description: "Check your 6 most recent plays"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }
        const recentSongs = await super.instance.beatSaberManager.fetchScores(userData.scoreSaberId, "RECENT", 1);
        const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
        if (recentSongs == null || player == null) {
            await channel.send("Unable to fetch recent songs...");
            return;
        }
        const header = await super.instance.beatSaberManager.createHeader(player, "RECENT SONGS");
        const headerAttachment = new discord_js_1.default.MessageAttachment(header, 'header.png');
        await channel.send(headerAttachment);
        const recentSongsImage = await super.instance.beatSaberManager.createSongsImage(player, "RECENT");
        if (recentSongsImage == undefined) {
            return;
        }
        const songsAttachment = new discord_js_1.default.MessageAttachment(recentSongsImage, 'songs.png');
        await channel.send(songsAttachment);
    }
};
