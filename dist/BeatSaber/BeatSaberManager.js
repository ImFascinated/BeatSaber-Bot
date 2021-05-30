"use strict";
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
const restClient_1 = require("typed-rest-client/restClient");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const canvas_1 = __importDefault(require("canvas"));
const axios_1 = __importDefault(require("axios"));
const date_fns_1 = require("date-fns");
const numeral_1 = __importDefault(require("numeral"));
const Manager_1 = __importDefault(require("../Utils/Manager"));
const discord_js_1 = __importDefault(require("discord.js"));
const chartjs_node_canvas_1 = require("chartjs-node-canvas");
const util = __importStar(require("util"));
const readFile = util.promisify(fs_1.default.readFile);
const xOffset = 16;
class BeatSaberManager extends Manager_1.default {
    constructor(instance) {
        super(instance);
        this.SCORESABER_HOST = 'https://new.scoresaber.com/api/';
        this.BEATSAVER_HOST = 'https://beatsaver.com/api/';
        this.restClientScoreSaber = new restClient_1.RestClient(null, this.SCORESABER_HOST);
        this.restClientBeatSaver = new restClient_1.RestClient("(+http://www.example.com/ScraperBot.html)", this.BEATSAVER_HOST);
        this.backgroundBuffer = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../resources/images/HeaderBackground.png'));
        this.noImageFoundBuffer = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../resources/images/NoImageFound.jpg'));
        this.playerStatsBackgroundBuffer = fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../resources/images/PlayerStatsBackground.png'));
        canvas_1.default.registerFont(path_1.default.resolve(__dirname, '../../resources/fonts/RobotoCondensed-Bold.ttf'), {
            family: "Roboto",
            style: "bold"
        });
        // Disabled for now
        //this.setupScoreFeedHandler();
    }
    async createHeader(player, type) {
        const canvas = canvas_1.default.createCanvas(1200, 220);
        const context = canvas.getContext('2d');
        const background = await canvas_1.default.loadImage(this.backgroundBuffer);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        try {
            const image = await canvas_1.default.loadImage(`https://new.scoresaber.com/api/static/avatars/${player.playerInfo.playerId}.jpg`);
            context.drawImage(image, 10, 10, 200, 200);
        }
        catch (err) {
            const image = await canvas_1.default.loadImage(this.noImageFoundBuffer);
            context.drawImage(image, 10, 10, 200, 200);
        }
        const textOffset = 205;
        let y = 55;
        context.font = `50px Roboto`;
        context.fillStyle = '#ffffff';
        context.fillText(`${player.playerInfo.playerName}`, textOffset + xOffset, y);
        const target1CountryImage = await canvas_1.default.loadImage(`https://www.countryflags.io/${player.playerInfo.country}/flat/64.png`);
        context.drawImage(target1CountryImage, textOffset + xOffset + 59, y + 14, 44, 44);
        y += 50;
        context.font = `40px Roboto`;
        context.fillStyle = '#C0C0C0';
        context.fillText(`${player.playerInfo.country}`, textOffset + xOffset, y);
        y += 50;
        context.font = `40px Roboto`;
        context.fillStyle = '#C0C0C0';
        context.fillText(`#${player.playerInfo.rank}`, textOffset + xOffset, y);
        context.font = `32px Roboto`;
        context.fillStyle = '#fff';
        context.fillText(`#${player.playerInfo.countryRank}`, (textOffset + xOffset) + (player.playerInfo.rank.toString().length * 27.5), y);
        y += 50;
        context.font = `40px Roboto`;
        context.fillStyle = '#C0C0C0';
        context.fillText(`${player.playerInfo.pp}pp`, textOffset + xOffset, y);
        context.font = `40px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'right';
        context.fillText(`${type.toUpperCase()}`, canvas.width - 60, canvas.height - xOffset);
        return canvas.toBuffer();
    }
    async createProfileImage(player) {
        const canvas = canvas_1.default.createCanvas(1200, 600);
        const context = canvas.getContext('2d');
        const topSongs = await this.fetchScores(player.playerInfo.playerId, "TOP", 0);
        const topSong = topSongs[0];
        const background = await canvas_1.default.loadImage(this.playerStatsBackgroundBuffer);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        // Player Info Panel
        const avatar = await canvas_1.default.loadImage(`https://new.scoresaber.com/api/static/avatars/${player.playerInfo.playerId}.jpg`);
        context.save();
        this.roundedImage(context, 60, 130, 200, 200, 10);
        context.clip();
        context.drawImage(avatar, 60, 130, 200, 200);
        context.restore();
        context.font = `40px Roboto`;
        context.fillStyle = '#fff';
        context.textAlign = 'left';
        let name = player.playerInfo.playerName;
        if (name.length > 23)
            name = player.playerInfo.playerName.substring(0, 23) + "...";
        context.fillText(`${name}`, 200 + 80, 175);
        const target1CountryImage = await canvas_1.default.loadImage(`https://www.countryflags.io/${player.playerInfo.country}/flat/64.png`);
        context.drawImage(target1CountryImage, 200 + 80, 185, 44, 44);
        context.font = `40px Roboto`;
        context.fillStyle = '#fff';
        context.fillText(`${player.playerInfo.country}`, 200 + 80 + 55, 220);
        context.font = `40px Roboto`;
        context.fillStyle = '#C0C0C0';
        context.fillText(`#${player.playerInfo.rank}`, 200 + 80, 275);
        context.font = `32px Roboto`;
        context.fillStyle = '#fff';
        context.fillText(`#${player.playerInfo.countryRank}`, (200 + 80) + (player.playerInfo.rank.toString().length * 27.5), 275);
        context.font = `40px Roboto`;
        context.fillStyle = '#fff';
        context.fillText(`${player.playerInfo.pp}pp`, 200 + 80, 315);
        // Best Play Panel
        const response = await this.restClientBeatSaver.get(`maps/by-hash/${topSong.songHash}`);
        if (response.result === null) {
            console.log(`Failed to fetch map data for song hash ${topSong.songHash} (status=${response.statusCode})`);
        }
        await this.instance.utils.sleep(1).then(async () => {
            const res = await axios_1.default.get("https://beatsaver.com" + response.result.coverURL, {
                responseType: 'arraybuffer',
                headers: { "User-Agent": { "ScraperBot": "1.0" } }
            });
            const artImage = await canvas_1.default.loadImage(Buffer.from(res.data, "utf-8"));
            context.save();
            this.roundedImage(context, canvas.width - (25 + 175), 410, 160, 160, 10);
            context.clip();
            context.drawImage(artImage, canvas.width - (25 + 175), 410, 160, 160);
            context.restore();
        });
        context.font = `46px Roboto`;
        context.fillStyle = '#a0a0a0';
        context.textAlign = 'left';
        context.fillText(`TOP PLAY`, 44, 460);
        context.font = `43px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'left';
        context.fillText(`${topSong.songName}`, 44, 505);
        context.font = `33px Roboto`;
        const diff = this.formatDiff(topSong).toUpperCase();
        context.fillStyle = this.getDiffColor(diff);
        context.textAlign = 'left';
        context.fillText(`${diff}`, 44, 544);
        context.font = `43px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'right';
        context.fillText(`${topSong.pp.toFixed(2)}PP`, canvas.width - (48 + 175), 505);
        const songMods = topSong.mods.split(",") || [topSong.mods];
        const acc = (((songMods.includes("NF") ? topSong.score * 2 : topSong.score) / topSong.maxScore) * 100).toFixed(2);
        context.font = `33px Roboto`;
        context.fillStyle = '#a0a0a0';
        context.textAlign = 'right';
        context.fillText(`${acc == "Infinity" ? "??" : acc}%`, canvas.width - (48 + 175), 544);
        // Player Stats Panel
        context.font = `43px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'left';
        context.fillText(`Acc`, canvas.width - 350, 163);
        context.font = `43px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'left';
        context.fillText(`${player.scoreStats.averageRankedAccuracy.toFixed(2)}%`, canvas.width - 250, 163);
        context.font = `38px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'left';
        context.fillText(`Score`, canvas.width - 350, 208);
        context.font = `38px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'left';
        context.fillText(`${numeral_1.default(player.scoreStats.totalScore).format('0,0')}`, canvas.width - 250, 208);
        context.font = `24px Roboto`;
        context.fillStyle = '#a0a0a0';
        context.textAlign = 'left';
        context.fillText(`Ranked`, canvas.width - 350, 246);
        context.font = `24px Roboto`;
        context.fillStyle = '#a0a0a0';
        context.textAlign = 'left';
        context.fillText(`${numeral_1.default(player.scoreStats.totalRankedScore).format('0,0')}`, canvas.width - 250, 246);
        context.font = `38px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'left';
        context.fillText(`Plays`, canvas.width - 350, 292);
        context.font = `38px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'left';
        context.fillText(`${player.scoreStats.totalPlayCount}`, canvas.width - 250, 292);
        context.font = `24px Roboto`;
        context.fillStyle = '#a0a0a0';
        context.textAlign = 'left';
        context.fillText(`Ranked`, canvas.width - 350, 328);
        context.font = `24px Roboto`;
        context.fillStyle = '#a0a0a0';
        context.textAlign = 'left';
        context.fillText(`${player.scoreStats.rankedPlayCount}`, canvas.width - 250, 328);
        return canvas.toBuffer();
    }
    async createSongsImage(player, type) {
        const canvas = canvas_1.default.createCanvas(1200, 1000);
        const context = canvas.getContext('2d');
        const background = await canvas_1.default.loadImage(this.backgroundBuffer);
        const songs = await this.fetchScores(player.playerInfo.playerId, type, 1);
        if (songs == null) {
            return undefined;
        }
        let y = 5;
        for (let i = 0; i < 6; i++) {
            const song = songs[i];
            const songMods = song.mods.split(",") || [song.mods];
            context.drawImage(background, 5, y, canvas.width - 5, 180);
            let textY = y + 45;
            let textOffset = 170;
            // Song Art
            const isSavedLocally = this.isSongArtSaved(song.songHash);
            console.log("isSavedLocally=" + isSavedLocally);
            if (isSavedLocally) {
                const artImage = await canvas_1.default.loadImage(await this.getSongArt(song.songHash));
                context.drawImage(artImage, 15, y + 10, 160, 160);
            }
            else {
                await this.instance.utils.sleep(1).then(async () => {
                    const response = await this.restClientBeatSaver.get(`maps/by-hash/${song.songHash}`);
                    if (response.result === null) {
                        console.log(`Failed to fetch map data for song hash ${song.songHash} (status=${response.statusCode})`);
                    }
                    await this.instance.utils.sleep(1).then(async () => {
                        const res = await axios_1.default.get("https://beatsaver.com" + response.result.coverURL, {
                            responseType: 'arraybuffer',
                            headers: { "User-Agent": { "ScraperBot": "1.0" } }
                        });
                        const artImage = await canvas_1.default.loadImage(Buffer.from(res.data, "utf-8"));
                        context.drawImage(artImage, 15, y + 10, 160, 160);
                        this.saveSongArt(song.songHash, Buffer.from(res.data, "utf-8"));
                    });
                });
            }
            // Song Name
            context.font = `40px Roboto`;
            context.fillStyle = '#ffffff';
            let name = song.songName;
            if (name.length > 40)
                name = song.songName.substring(0, 40) + "...";
            context.textAlign = 'left';
            context.fillText(`${name}`, textOffset + xOffset, textY);
            // Position and Score Percent
            textY += 50;
            context.font = `40px Roboto`;
            context.textAlign = 'left';
            context.fillStyle = '#C0C0C0';
            context.fillText(`#${song.rank}`, textOffset + xOffset, textY);
            // PP Value
            textY += 15;
            if (song.pp > 0) {
                context.font = `55px Roboto`;
                context.fillStyle = '#33FF33';
                context.textAlign = 'right';
                context.fillText(`+${song.pp.toFixed(2)} pp`, canvas.width - 15, y + 65);
            }
            else {
                context.font = `55px Roboto`;
                context.fillStyle = '#fff';
                context.textAlign = 'right';
                context.fillText(`Unranked`, canvas.width - 15, y + 65);
            }
            // Accuracy
            context.font = `50px Roboto`;
            const acc = (((songMods.includes("NF") ? song.score * 2 : song.score) / song.maxScore) * 100).toFixed(2);
            context.fillStyle = "#fff"; //getAccColor(Number.parseInt(acc));
            context.textAlign = 'right';
            context.fillText(`${acc == "Infinity" ? "??" : acc}%`, canvas.width - 15, y + 125);
            // NF
            if (songMods.includes("NF")) {
                context.font = `30px Roboto`;
                context.fillStyle = '#C0C0C0';
                context.textAlign = 'right';
                context.fillText(`NF`, canvas.width - 170, y + 111);
            }
            const time = Date.parse(song.timeSet);
            // Time Set
            textY += 55;
            context.font = `30px Roboto`;
            context.fillStyle = '#C0C0C0';
            context.textAlign = 'right';
            context.fillText(`${date_fns_1.formatDistance(time, new Date(), { addSuffix: true }).toUpperCase()}`, canvas.width - 15, textY);
            // Difficulty
            const diff = this.formatDiff(song);
            context.textAlign = 'left';
            context.font = `30px Roboto`;
            context.fillStyle = this.getDiffColor(diff);
            context.fillText(`${diff.toUpperCase()}`, textOffset + xOffset, textY);
            y += 200;
        }
        return canvas.toBuffer();
    }
    async createComparisonHeaderImage(target1, target2) {
        const canvas = canvas_1.default.createCanvas(1200, 250);
        const context = canvas.getContext('2d');
        const background = await canvas_1.default.loadImage(this.backgroundBuffer);
        context.drawImage(background, 5, 5, canvas.width - 5, canvas.height - 5);
        context.font = `60px Roboto`;
        context.fillStyle = '#fff';
        context.font = `50px Roboto`;
        let name1 = target1.playerInfo.playerName;
        if (name1.length > 27)
            name1 = target1.playerInfo.playerName.substring(0, 27) + "...";
        let name2 = target2.playerInfo.playerName;
        if (name2.length > 27)
            name2 = target2.playerInfo.playerName.substring(0, 27) + "...";
        context.textAlign = 'left';
        context.fillText(name1, 260, 70, 1000);
        context.textAlign = 'right';
        context.fillText(name2, canvas.width - 260, 215, 1000);
        // VS Text
        context.font = `70px Roboto`;
        context.textAlign = 'center';
        context.fillText("VS", canvas.width / 2, canvas.height / 1.6, 1000);
        // Target Countries
        const target1CountryImage = await canvas_1.default.loadImage(`https://www.countryflags.io/${target1.playerInfo.country}/flat/64.png`);
        context.drawImage(target1CountryImage, 260, 90, 64, 64);
        const target2CountryImage = await canvas_1.default.loadImage(`https://www.countryflags.io/${target2.playerInfo.country}/flat/64.png`);
        context.drawImage(target2CountryImage, canvas.width - 324, 105, 64, 64);
        // Add the pfps
        try {
            const target1Image = await canvas_1.default.loadImage(`https://new.scoresaber.com/api/static/avatars/${target1.playerInfo.playerId}.jpg`);
            context.drawImage(target1Image, 10, 13, 230, 230);
        }
        catch (err) { }
        try {
            const target2Image = await canvas_1.default.loadImage(`https://new.scoresaber.com/api/static/avatars/${target2.playerInfo.playerId}.jpg`);
            context.drawImage(target2Image, 960, 13, 230, 230);
        }
        catch (err) {
            const target2Image = await canvas_1.default.loadImage(this.noImageFoundBuffer);
            context.drawImage(target2Image, 960, 13, 230, 230);
        }
        return canvas.toBuffer();
    }
    async createComparisonImage(target1, target2) {
        const canvas = canvas_1.default.createCanvas(1200, 800);
        const context = canvas.getContext('2d');
        const background = await canvas_1.default.loadImage(this.backgroundBuffer);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        let y = 90;
        const list = [
            "Global Rank",
            "Country Rank",
            "PP",
            "Accuracy",
            "Play Count",
            "Ranked Play Count",
            "Score",
            "Ranked Score",
            "Badge Count",
            "Top PP Play"
        ];
        for (let i = 0; i < list.length; i++) {
            const name = list[i];
            context.font = `47px Roboto`;
            context.fillStyle = "#fff";
            switch (name) {
                case "Global Rank": {
                    const target1GlobalRank = target1.playerInfo.rank;
                    const target2GlobalRank = target2.playerInfo.rank;
                    context.fillStyle = target1GlobalRank > target2GlobalRank ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText("#" + numeral_1.default(target1GlobalRank).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1GlobalRank < target2GlobalRank ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText("#" + numeral_1.default(target2GlobalRank).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }
                case "Country Rank": {
                    const target1CountryRank = target1.playerInfo.countryRank;
                    const target2CountryRank = target2.playerInfo.countryRank;
                    context.fillStyle = target1CountryRank > target2CountryRank ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText("#" + numeral_1.default(target1CountryRank).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1CountryRank < target2CountryRank ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText("#" + numeral_1.default(target2CountryRank).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }
                case "PP": {
                    const target1PP = target1.playerInfo.pp;
                    const target2PP = target2.playerInfo.pp;
                    context.fillStyle = target1PP < target2PP ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(target1PP).format('0,0') + "pp", 40, y, 1000);
                    context.fillStyle = target1PP > target2PP ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText(numeral_1.default(target2PP).format('0,0') + "pp", canvas.width - 40, y, 1000);
                    break;
                }
                case "Accuracy": {
                    const target1Accuracy = target1.scoreStats.averageRankedAccuracy.toFixed(2);
                    const target2Accuracy = target2.scoreStats.averageRankedAccuracy.toFixed(2);
                    context.fillStyle = target1Accuracy < target2Accuracy ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText(target1Accuracy + "%", 40, y, 1000);
                    context.fillStyle = target1Accuracy > target2Accuracy ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText(target2Accuracy + "%", canvas.width - 40, y, 1000);
                    break;
                }
                case "Play Count": {
                    const target1PlayCount = target1.scoreStats.totalPlayCount.toString();
                    const target2PlayCount = target2.scoreStats.totalPlayCount.toString();
                    context.fillStyle = target1PlayCount < target2PlayCount ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(target1PlayCount).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1PlayCount > target2PlayCount ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText(numeral_1.default(target2PlayCount).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }
                case "Ranked Play Count": {
                    const target1RankedPlayCount = target1.scoreStats.rankedPlayCount.toString();
                    const target2RankedPlayCount = target2.scoreStats.rankedPlayCount.toString();
                    context.fillStyle = target1RankedPlayCount < target2RankedPlayCount ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(target1RankedPlayCount).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1RankedPlayCount > target2RankedPlayCount ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText(numeral_1.default(target2RankedPlayCount).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }
                case "Score": {
                    const target1Score = target1.scoreStats.totalScore.toString();
                    const target2Score = target2.scoreStats.totalScore.toString();
                    context.fillStyle = target1Score < target2Score ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(target1Score).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1Score > target2Score ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText(numeral_1.default(target2Score).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }
                case "Ranked Score": {
                    const target1Score = target1.scoreStats.totalRankedScore.toString();
                    const target2Score = target2.scoreStats.totalRankedScore.toString();
                    context.fillStyle = target1Score < target2Score ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(target1Score).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1Score > target2Score ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText(numeral_1.default(target2Score).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }
                case "Badge Count": {
                    const target1Badges = target1.playerInfo.badges.length.toString();
                    const target2Badges = target2.playerInfo.badges.length.toString();
                    context.textAlign = 'left';
                    context.fillText(target1Badges, 40, y, 1000);
                    context.textAlign = 'right';
                    context.fillText(target2Badges, canvas.width - 40, y, 1000);
                    break;
                }
                case "Top PP Play": {
                    const target1Scores = await this.fetchScores(target1.playerInfo.playerId, "TOP", 1);
                    const target2Scores = await this.fetchScores(target2.playerInfo.playerId, "TOP", 1);
                    context.fillStyle = target1Scores[0].pp < target2Scores[0].pp ? "#FF5733" : "#33FF33";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(target1Scores[0].pp).format('0,0') + "pp", 40, y, 1000);
                    context.fillStyle = target1Scores[0].pp > target2Scores[0].pp ? "#FF5733" : "#33FF33";
                    context.textAlign = 'right';
                    context.fillText(numeral_1.default(target2Scores[0].pp).format('0,0') + "pp", canvas.width - 40, y, 1000);
                    break;
                }
            }
            context.fillStyle = '#fff';
            context.textAlign = 'center';
            context.fillText(name, canvas.width / 2, y, 1000);
            y += 73;
        }
        return canvas.toBuffer();
    }
    async createSongBanner(song) {
        const canvas = canvas_1.default.createCanvas(1200, 700);
        const context = canvas.getContext('2d');
        const response = await this.restClientBeatSaver.get(`maps/by-hash/${song.songHash}`);
        if (response.result === null) {
            console.log(`Failed to fetch map data for song hash ${song.songHash} (status=${response.statusCode})`);
        }
        await this.instance.utils.sleep(1).then(async () => {
            const res = await axios_1.default.get("https://beatsaver.com" + response.result.coverURL, {
                responseType: 'arraybuffer',
                headers: { "User-Agent": { "ScraperBot": "1.0" } }
            });
            const artImage = await canvas_1.default.loadImage(Buffer.from(res.data, "utf-8"));
            context.drawImage(artImage, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            for (let i = 0; i < pixels.length; i += 4) {
                pixels[i] = pixels[i] * 0.30;
                pixels[i + 1] = pixels[i + 1] * 0.30;
                pixels[i + 2] = pixels[i + 2] * 0.30;
            }
            context.putImageData(imageData, 0, 0);
        });
        let y = 55;
        let x = 15;
        let infoX = 310;
        let rightY = y;
        context.font = `55px Roboto`;
        let types = [
            "BPM",
            "Duration",
            "Notes",
            "NJS",
            "NJS Offset",
            "Bombs",
            "Obstacles",
            "Max Score",
            "Mods",
            "Position",
            "PP",
            "Accuracy"
        ];
        const songInfo = this.toDiff(this.formatDiff(song), response.result.metadata.characteristics[0]);
        for (const type of types) {
            switch (type) {
                case "BPM": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(response.result.metadata.bpm.toString(), infoX, y, 1000);
                    break;
                }
                case "Duration": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(super.instance.utils.formatTime(response.result.metadata.duration * 1000, true), infoX, y, 1000);
                    break;
                }
                case "Notes": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(songInfo.notes.toString()).format('0,0'), infoX, y, 1000);
                    break;
                }
                case "NJS": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(songInfo.njs.toString(), infoX, y, 1000);
                    break;
                }
                case "NJS Offset": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(songInfo.njsOffset.toFixed(2).toString(), infoX, y, 1000);
                    break;
                }
                case "Bombs": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(songInfo.bombs.toString()).format('0,0'), infoX, y, 1000);
                    break;
                }
                case "Obstacles": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(songInfo.obstacles.toString()).format('0,0'), infoX, y, 1000);
                    break;
                }
                case "Max Score": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral_1.default(song.maxScore.toString()).format('0,0'), infoX, y, 1000);
                    break;
                }
                case "Mods": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);
                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(song.mods.toString(), infoX, y, 1000);
                    break;
                }
                case "Position": {
                    context.fillStyle = "#fff";
                    context.textAlign = 'right';
                    context.fillText("#" + numeral_1.default(song.rank).format('0,0'), canvas.width - x, rightY, 1000);
                    rightY += 55;
                    break;
                }
                case "PP": {
                    context.fillStyle = "#fff";
                    context.textAlign = 'right';
                    context.fillText(song.pp.toFixed(2) + " PP (" + (song.pp * song.weight).toFixed(2) + "PP)", canvas.width - x, rightY, 1000);
                    rightY += 55;
                    break;
                }
                case "Accuracy": {
                    context.fillStyle = "#fff";
                    context.textAlign = 'right';
                    context.fillText(((song.score / song.maxScore) * 100).toFixed(2) + "%", canvas.width - x, rightY, 1000);
                    rightY += 55;
                    break;
                }
            }
            y += 55;
        }
        return canvas.toBuffer();
    }
    async createRankHistory(player) {
        const canvas = canvas_1.default.createCanvas(1400, 1000);
        const context = canvas.getContext('2d');
        const width = 700;
        const height = 500;
        const chartJSNodeCanvas = new chartjs_node_canvas_1.ChartJSNodeCanvas({ width, height });
        let history = [];
        for (let string of player.playerInfo.history.split(",")) {
            history.push(Number.parseInt(string));
        }
        //history = history.reverse();
        const data = {
            labels: [
                -48, -47, -46, -45, -44, -43, -42, -41, -40, -39, -38, -37, -36, -35, -34, -33, -32, -31, -30, -29, -28, -27, -26,
                -25, -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0
            ],
            datasets: [
                {
                    label: `${player.playerInfo.playerName}'s Rank History`,
                    data: history,
                    fill: false,
                    borderColor: "rgb(255, 99, 132)"
                }
            ]
        };
        const configuration = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    yAxes: [{
                            ticks: {
                                reverse: true
                            }
                        }]
                }
            }
        };
        const background = await canvas_1.default.loadImage(this.backgroundBuffer);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        const chart = await chartJSNodeCanvas.renderToBuffer(configuration);
        const chartImage = await canvas_1.default.loadImage(chart);
        context.drawImage(chartImage, 0, 0, canvas.width, canvas.height);
        return canvas.toBuffer();
    }
    async getPlayer(id) {
        const response = await this.restClientScoreSaber.get(`player/${id}/full`);
        if (response.result === null) {
            console.log(`Failed to fetch player ${id} (status=${response.statusCode})`);
            return null;
        }
        return response.result;
    }
    async fetchScores(id, order, offset) {
        const response = await this.restClientScoreSaber.get(`player/${id}/scores/${order}/${offset}`);
        if (response.result === null) {
            console.log(`Failed to fetch scores for ${id} (status=${response.statusCode})`);
            return null;
        }
        return response.result.scores;
    }
    async fetchLeaderboard() {
        const response = await this.restClientScoreSaber.get(`players/1`);
        if (response.result === null) {
            console.log(`Failed to fetch top 50 scores (status=${response.statusCode})`);
            return [];
        }
        return response.result.players;
    }
    toDiff(diff, diffs) {
        switch (diff) {
            case "Easy": {
                return diffs.difficulties.easy;
            }
            case "Normal": {
                return diffs.difficulties.normal;
            }
            case "Hard": {
                return diffs.difficulties.hard;
            }
            case "Expert": {
                return diffs.difficulties.expert;
            }
            case "Expert Plus": {
                return diffs.difficulties.expertPlus;
            }
        }
    }
    getDiffColor(diff) {
        switch (diff) {
            // green, aqua, orange, red & purple
            case "EASY": {
                return "#33FF33";
            }
            case "NORMAL": {
                return "#00ffff";
            }
            case "HARD": {
                return "#fc9303";
            }
            case "EXPERT": {
                return "#e71837";
            }
            case "EXPERT+": {
                return "#8f48db";
            }
        }
        return "#fff";
    }
    async setupScoreFeedHandler() {
        const client = super.instance.client;
        setInterval(async () => {
            const users = super.instance.userDataManager.users;
            for (const usr of users) {
                const user = usr[1];
                if (user.scoreFeedChannelId == "")
                    continue;
                const channel = client.channels.cache.get(user.scoreFeedChannelId);
                if (!channel)
                    continue;
                const latestScores = await super.instance.beatSaberManager.fetchScores(user.scoreSaberId, "RECENT", 0);
                if (!latestScores)
                    continue;
                const latestScore = latestScores[0];
                if (latestScore.scoreId == user.lastScore.scoreId)
                    continue;
                const banner = await super.instance.beatSaberManager.createSongBanner(latestScore);
                const bannerAttachment = new discord_js_1.default.MessageAttachment(banner, 'banner.png');
                await channel.send("!! SCORE SET BY <@" + user.id + "> !!");
                await channel.send("`" + latestScore.songName + "`");
                await channel.send(bannerAttachment);
                user.lastScore = {
                    scoreId: latestScore.scoreId
                };
            }
        }, 30000);
    }
    roundedImage(canvas, x, y, width, height, radius) {
        canvas.beginPath();
        canvas.moveTo(x + radius, y);
        canvas.lineTo(x + width - radius, y);
        canvas.quadraticCurveTo(x + width, y, x + width, y + radius);
        canvas.lineTo(x + width, y + height - radius);
        canvas.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        canvas.lineTo(x + radius, y + height);
        canvas.quadraticCurveTo(x, y + height, x, y + height - radius);
        canvas.lineTo(x, y + radius);
        canvas.quadraticCurveTo(x, y, x + radius, y);
        canvas.closePath();
    }
    formatDiff(song) {
        return song.difficultyRaw
            .replaceAll("_", "")
            .replaceAll("SoloStandard", "")
            .replaceAll("ExpertPlus", "Expert+")
            .toUpperCase();
    }
    saveSongArt(songHash, buffer) {
        let error = false;
        fs_1.default.writeFile(path_1.default.resolve(__dirname, `../../resources/images/song-art/${songHash}.png`), buffer, (err) => {
            if (err) {
                error = true;
                return;
            }
            super.log("Saved image locally: " + songHash);
        });
        return error;
    }
    getSongArt(songHash) {
        return readFile(path_1.default.resolve(__dirname, `../../resources/images/song-art/${songHash}.png`));
    }
    isSongArtSaved(songHash) {
        return this.getSongArt(songHash) != null;
    }
}
exports.default = BeatSaberManager;
