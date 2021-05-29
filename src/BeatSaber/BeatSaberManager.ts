/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */
import {MapDifficulty} from "./BeatSaver/MapDifficulty";
import BatClient from "../Client/BatClient";
import {IRestResponse, RestClient} from "typed-rest-client/restClient";
import fs from "fs";
import path from "path";
import Canvas from "canvas";
import axios from "axios";
import {formatDistance} from "date-fns";
import numeral from "numeral";
import {Player} from "./ScoreSaber/Player";
import {MapInfo} from "./BeatSaver/MapInfo";
import Score from "./ScoreSaber/Score";
import ScoreReply from "./ScoreSaber/ScoreReply";
import Manager from "../Utils/Manager";
import {LeaderboardReply} from "./ScoreSaber/LeaderboardReply";
import {PlayerInfo} from "./ScoreSaber/PlayerInfo";
import Discord, {MessageEmbed} from "discord.js";
import moment from "moment";

const xOffset = 16;

export default class BeatSaberManager extends Manager {
    private readonly SCORESABER_HOST: string = 'https://new.scoresaber.com/api/';
    private readonly BEATSAVER_HOST: string = 'https://beatsaver.com/api/';

    private readonly restClientScoreSaber: RestClient = new RestClient(null, this.SCORESABER_HOST);
    readonly restClientBeatSaver: RestClient = new RestClient("(+http://www.example.com/ScraperBot.html)", this.BEATSAVER_HOST);
    private readonly backgroundBuffer: Buffer;
    private readonly noImageFoundBuffer: Buffer;

    private readonly songCache: Map<String, Buffer> = new Map<String, Buffer>();

    constructor(instance: BatClient) {
        super(instance);
        this.backgroundBuffer = fs.readFileSync(path.resolve(__dirname, '../../resources/images/HeaderBackground.png'));
        this.noImageFoundBuffer = fs.readFileSync(path.resolve(__dirname, '../../resources/images/NoImageFound.jpg'));
        Canvas.registerFont(path.resolve(__dirname, '../../resources/fonts/RobotoCondensed-Bold.ttf'), {
            family: "Roboto",
            style: "bold"
        });

        this.setupScoreFeedHandler();
    }

    async createHeader(player: Player, type: string): Promise<Buffer> {
        const canvas = Canvas.createCanvas(1200, 220);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(this.backgroundBuffer)
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        try {
            const image = await Canvas.loadImage(`https://new.scoresaber.com/api/static/avatars/${player.playerInfo.playerId}.jpg`);
            context.drawImage(image, 10, 10, 200, 200);
        } catch (err) {
            const image = await Canvas.loadImage(this.noImageFoundBuffer);
            context.drawImage(image, 10, 10, 200, 200);
        }

        const textOffset = 205;
        let y = 55;
        context.font = `50px Roboto`;
        context.fillStyle = '#ffffff';
        context.fillText(`${player.playerInfo.playerName}`, textOffset + xOffset, y);

        const target1CountryImage = await Canvas.loadImage(`https://www.countryflags.io/${player.playerInfo.country}/flat/64.png`);
        context.drawImage(target1CountryImage, textOffset + xOffset + 59, y + 14, 44, 44);

        y+=50;
        context.font = `40px Roboto`;
        context.fillStyle = '#C0C0C0';
        context.fillText(`${player.playerInfo.country}`, textOffset + xOffset, y);

        y+=50;
        context.font = `40px Roboto`;
        context.fillStyle = '#C0C0C0';
        context.fillText(`#${player.playerInfo.rank}`, textOffset + xOffset, y);

        context.font = `32px Roboto`;
        context.fillStyle = '#fff';
        context.fillText(`#${player.playerInfo.countryRank}`, (textOffset + xOffset) + (player.playerInfo.rank.toString().length * 27.5), y);

        y+=50;
        context.font = `40px Roboto`;
        context.fillStyle = '#C0C0C0';
        context.fillText(`${player.playerInfo.pp}pp`, textOffset + xOffset, y);

        context.font = `40px Roboto`;
        context.fillStyle = '#ffffff';
        context.textAlign = 'right';
        context.fillText(`${type.toUpperCase()}`, canvas.width-60, canvas.height-xOffset);

        return canvas.toBuffer();
    }

    async createSongsImage(player: Player, type: string): Promise<Buffer | undefined> {
        const canvas = Canvas.createCanvas(1200, 1000);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(this.backgroundBuffer)

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
            if (this.songCache.has(song.songHash)) {
                const artImage = await Canvas.loadImage(this.songCache.get(song.songHash)!);

                context.drawImage(artImage, 15, y + 10, 160, 160);
            } else {
                await this.instance.utils.sleep(1).then(async() => {
                    const response: IRestResponse<MapInfo> = await this.restClientBeatSaver.get<MapInfo>(`maps/by-hash/${song.songHash}`);
                    if (response.result === null) {
                        console.log(`Failed to fetch map data for song hash ${song.songHash} (status=${response.statusCode})`);
                    }
                    await this.instance.utils.sleep(1).then(async() => {
                        const res = await axios.get("https://beatsaver.com" + response.result!.coverURL,
                            {
                                responseType: 'arraybuffer',
                                headers: { "User-Agent": { "ScraperBot": "1.0" } }
                            });
                        const artImage = await Canvas.loadImage(Buffer.from(res.data, "utf-8"));
                        context.drawImage(artImage, 15, y + 10, 160, 160);

                        this.songCache.set(song.songHash, Buffer.from(res.data, "utf-8"));
                    });
                });
            }

            // Song Name
            context.font = `40px Roboto`;
            context.fillStyle = '#ffffff';

            let name = song.songName;
            if (name.length > 40)
                name = song.songName.substring(0, 40) + "..."
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
            } else {
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
            context.fillText(`${formatDistance(time, new Date(), { addSuffix: true }).toUpperCase()}`, canvas.width - 15, textY);

            // Difficulty
            const diff = song.difficultyRaw
                .replaceAll("_", "")
                .replaceAll("SoloStandard", "")
                .replaceAll("ExpertPlus", "Expert Plus");
            context.textAlign = 'left';
            context.font = `30px Roboto`;
            context.fillStyle = this.getDiffColor(diff);
            context.fillText(`${diff.toUpperCase()}`, textOffset + xOffset, textY);
            y+=200;
        }
        return canvas.toBuffer();
    }

    async createComparisonHeaderImage(target1: Player, target2: Player): Promise<Buffer | undefined> {
        const canvas = Canvas.createCanvas(1200, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(this.backgroundBuffer)
        context.drawImage(background, 5, 5, canvas.width - 5, canvas.height - 5);

        context.font = `60px Roboto`;
        context.fillStyle = '#fff';

        context.font = `50px Roboto`;
        let name1 = target1.playerInfo.playerName;
        if (name1.length > 27)
            name1 = target1.playerInfo.playerName.substring(0, 27) + "..."
        let name2 = target2.playerInfo.playerName;
        if (name2.length > 27)
            name2 = target2.playerInfo.playerName.substring(0, 27) + "..."
        context.textAlign = 'left';
        context.fillText(name1, 260, 70, 1000);
        context.textAlign = 'right';
        context.fillText(name2, canvas.width - 260, 215, 1000);

        // VS Text
        context.font = `70px Roboto`;
        context.textAlign = 'center';
        context.fillText("VS", canvas.width / 2, canvas.height / 1.6, 1000);

        // Target Countries
        const target1CountryImage = await Canvas.loadImage(`https://www.countryflags.io/${target1.playerInfo.country}/flat/64.png`);
        context.drawImage(target1CountryImage, 260, 90, 64, 64);

        const target2CountryImage = await Canvas.loadImage(`https://www.countryflags.io/${target2.playerInfo.country}/flat/64.png`);
        context.drawImage(target2CountryImage, canvas.width - 324, 105, 64, 64);

        // Add the pfps
        try {
            const target1Image = await Canvas.loadImage(`https://new.scoresaber.com/api/static/avatars/${target1.playerInfo.playerId}.jpg`);
            context.drawImage(target1Image, 10, 13, 230, 230);
        } catch(err) {}

        try {
            const target2Image = await Canvas.loadImage(`https://new.scoresaber.com/api/static/avatars/${target2.playerInfo.playerId}.jpg`);
            context.drawImage(target2Image, 960, 13, 230, 230);
        } catch (err) {
            const target2Image = await Canvas.loadImage(this.noImageFoundBuffer);
            context.drawImage(target2Image, 960, 13, 230, 230);
        }

        return canvas.toBuffer();
    }

    async createComparisonImage(target1: Player, target2: Player): Promise<Buffer | undefined> {
        const canvas = Canvas.createCanvas(1200, 800);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(this.backgroundBuffer)

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

                    context.fillStyle = target1GlobalRank > target2GlobalRank ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText("#" + numeral(target1GlobalRank).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1GlobalRank < target2GlobalRank ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText("#" + numeral(target2GlobalRank).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }

                case "Country Rank": {
                    const target1CountryRank = target1.playerInfo.countryRank;
                    const target2CountryRank = target2.playerInfo.countryRank;

                    context.fillStyle = target1CountryRank > target2CountryRank ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText("#" + numeral(target1CountryRank).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1CountryRank < target2CountryRank ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText("#" + numeral(target2CountryRank).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }

                case "PP": {
                    const target1PP = target1.playerInfo.pp;
                    const target2PP = target2.playerInfo.pp;

                    context.fillStyle = target1PP < target2PP ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText(numeral(target1PP).format('0,0') + "pp", 40, y, 1000);
                    context.fillStyle = target1PP > target2PP ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText(numeral(target2PP).format('0,0') + "pp", canvas.width - 40, y, 1000);
                    break;
                }

                case "Accuracy": {
                    const target1Accuracy = target1.scoreStats.averageRankedAccuracy.toFixed(2);
                    const target2Accuracy = target2.scoreStats.averageRankedAccuracy.toFixed(2);

                    context.fillStyle = target1Accuracy < target2Accuracy ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText(target1Accuracy + "%", 40, y, 1000);
                    context.fillStyle = target1Accuracy > target2Accuracy ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText(target2Accuracy + "%", canvas.width - 40, y, 1000);
                    break;
                }

                case "Play Count": {
                    const target1PlayCount = target1.scoreStats.totalPlayCount.toString();
                    const target2PlayCount = target2.scoreStats.totalPlayCount.toString();

                    context.fillStyle = target1PlayCount < target2PlayCount ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText(numeral(target1PlayCount).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1PlayCount > target2PlayCount ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText(numeral(target2PlayCount).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }

                case "Ranked Play Count": {
                    const target1RankedPlayCount = target1.scoreStats.rankedPlayCount.toString();
                    const target2RankedPlayCount = target2.scoreStats.rankedPlayCount.toString();

                    context.fillStyle = target1RankedPlayCount < target2RankedPlayCount ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText(numeral(target1RankedPlayCount).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1RankedPlayCount > target2RankedPlayCount ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText(numeral(target2RankedPlayCount).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }

                case "Score": {
                    const target1Score = target1.scoreStats.totalScore.toString();
                    const target2Score = target2.scoreStats.totalScore.toString();

                    context.fillStyle = target1Score < target2Score ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText(numeral(target1Score).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1Score > target2Score ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText(numeral(target2Score).format('0,0'), canvas.width - 40, y, 1000);
                    break;
                }

                case "Ranked Score": {
                    const target1Score = target1.scoreStats.totalRankedScore.toString();
                    const target2Score = target2.scoreStats.totalRankedScore.toString();

                    context.fillStyle = target1Score < target2Score ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText(numeral(target1Score).format('0,0'), 40, y, 1000);
                    context.fillStyle = target1Score > target2Score ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText(numeral(target2Score).format('0,0'), canvas.width - 40, y, 1000);
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

                    context.fillStyle = target1Scores![0].pp < target2Scores![0].pp ? "#FF5733" : "#33FF33"
                    context.textAlign = 'left';
                    context.fillText(numeral(target1Scores![0].pp).format('0,0') + "pp", 40, y, 1000);
                    context.fillStyle = target1Scores![0].pp > target2Scores![0].pp ? "#FF5733" : "#33FF33"
                    context.textAlign = 'right';
                    context.fillText(numeral(target2Scores![0].pp).format('0,0') + "pp", canvas.width - 40, y, 1000);
                    break;
                }
            }

            context.fillStyle = '#fff';
            context.textAlign = 'center';
            context.fillText(name, canvas.width / 2, y, 1000);
            y+=73;
        }

        return canvas.toBuffer();
    }

    async createSongBanner(song: Score): Promise<Buffer> {
        const canvas = Canvas.createCanvas(1200, 700);
        const context = canvas.getContext('2d');

        const response: IRestResponse<MapInfo> = await this.restClientBeatSaver.get<MapInfo>(`maps/by-hash/${song.songHash}`);
        if (response.result === null) {
            console.log(`Failed to fetch map data for song hash ${song.songHash} (status=${response.statusCode})`);
        }
        await this.instance.utils.sleep(1).then(async() => {
            const res = await axios.get("https://beatsaver.com" + response.result!.coverURL,
                {
                    responseType: 'arraybuffer',
                    headers: { "User-Agent": { "ScraperBot": "1.0" } }
                });
            const artImage = await Canvas.loadImage(Buffer.from(res.data, "utf-8"));
            context.drawImage(artImage, 0, 0, canvas.width, canvas.height);
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const pixels = imageData.data;
            for(let i = 0; i < pixels.length; i += 4) {
                pixels[i] = pixels[i] * 0.30;
                pixels[i+1] = pixels[i+1] * 0.30;
                pixels[i+2] = pixels[i+2] * 0.30;
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

        const songInfo = this.toDiff(song.difficultyRaw
                .replaceAll("_", "")
                .replaceAll("SoloStandard", "")
                .replaceAll("ExpertPlus", "Expert Plus"),
            response.result!.metadata.characteristics[0]
        )

        for (const type of types) {
            switch (type) {
                case "BPM": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(response.result!.metadata.bpm.toString(), infoX, y, 1000);
                    break;
                }
                case "Duration": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(super.instance.utils.formatTime(response.result!.metadata.duration * 1000, true), infoX, y, 1000);
                    break;
                }
                case "Notes": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral(songInfo!.notes.toString()).format('0,0'), infoX, y, 1000);
                    break;
                }
                case "NJS": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(songInfo!.njs.toString(), infoX, y, 1000);
                    break;
                }
                case "NJS Offset": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(songInfo!.njsOffset.toFixed(2).toString(), infoX, y, 1000);
                    break;
                }
                case "Bombs": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral(songInfo!.bombs.toString()).format('0,0'), infoX, y, 1000);
                    break;
                }
                case "Obstacles": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral(songInfo!.obstacles.toString()).format('0,0'), infoX, y, 1000);
                    break;
                }
                case "Max Score": {
                    context.fillStyle = "#C0C0C0";
                    context.textAlign = 'left';
                    context.fillText(type + ":", x, y, 1000);

                    context.fillStyle = "#fff";
                    context.textAlign = 'left';
                    context.fillText(numeral(song.maxScore.toString()).format('0,0'), infoX, y, 1000);
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
                    context.fillText("#" + numeral(song.rank).format('0,0'), canvas.width - x, rightY, 1000);
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

    async getPlayer(id: string): Promise<Player | null> {
        const response: IRestResponse<Player> = await this.restClientScoreSaber.get<Player>(`player/${id}/full`);
        if (response.result === null) {
            console.log(`Failed to fetch player ${id} (status=${response.statusCode})`);
            return null;
        }

        return response.result;
    }

    async fetchScores(id: string, order: string, offset: number): Promise<Score[] | null>  {
        const response: IRestResponse<ScoreReply> = await this.restClientScoreSaber.get<ScoreReply>(`player/${id}/scores/${order}/${offset}`);
        if (response.result === null) {
            console.log(`Failed to fetch scores for ${id} (status=${response.statusCode})`);
            return null;
        }

        return response.result.scores;
    }

    async fetchLeaderboard(): Promise<PlayerInfo[]>  {
        const response: IRestResponse<LeaderboardReply> = await this.restClientScoreSaber.get<LeaderboardReply>(`players/1`);
        if (response.result === null) {
            console.log(`Failed to fetch top 50 scores (status=${response.statusCode})`);
            return [];
        }

        return response.result.players;
    }

    private toDiff(diff: string, diffs: MapDifficulty) {
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

    private getDiffColor(diff: string): string {
        switch (diff) {
            // green, aqua, orange, red & purple
            case "Easy": {
                return "#33FF33";
            }
            case "Normal": {
                return "#00ffff";
            }
            case "Hard": {
                return "#fc9303";
            }
            case "Expert": {
                return "#e71837";
            }
            case "Expert Plus": {
                return "#8f48db";
            }
        }
        return "#fff";
    }

    private setupScoreFeedHandler() {
        const client = super.instance.client;

        setInterval(async () => {
            const users = super.instance.userDataManager.users;

            for (const usr of users) {
                const user = usr[1];

                if (user.scoreFeedChannelId == "")
                    continue;
                const channel: any = client.channels.cache.get(user.scoreFeedChannelId);
                if (!channel)
                    continue;

                const latestScores = await super.instance.beatSaberManager.fetchScores(user.scoreSaberId, "RECENT", 0);
                if (!latestScores)
                    continue;
                const latestScore = latestScores[0];

                if (latestScore.scoreId == user.lastScore.scoreId)
                    continue;

                const banner: Buffer = await super.instance.beatSaberManager.createSongBanner(latestScore);
                const bannerAttachment = new Discord.MessageAttachment(banner, 'banner.png');

                await channel.send("!! SCORE SET BY <@" + user.id + "> !!")
                await channel.send("`" + latestScore.songName + "`")
                await channel.send(bannerAttachment);
                user.lastScore = {
                    scoreId: latestScore.scoreId
                }
            }
        }, 30000);
    }
}