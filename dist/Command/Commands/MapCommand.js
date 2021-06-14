"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 12/06/2021
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
const discord_js_1 = __importStar(require("discord.js"));
module.exports = class MapCommand extends Command_1.default {
    constructor() {
        super("map", {
            category: "beatsaber",
            description: "Get information about a map",
            usage: "[map key]"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        const args = commandArguments.args;
        const guildSettings = commandArguments.guildSettings;
        const map = await super.instance.beatSaberManager.fetchMapInfo(args[0]);
        if (map == null) {
            await channel.send("Unknown map");
            return;
        }
        const banner = await super.instance.beatSaberManager.createMapInfo(map);
        const bannerAttachment = new discord_js_1.default.MessageAttachment(banner, 'map.png');
        await channel.send(new discord_js_1.MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setTimestamp()
            .setTitle(map.metadata.songName + " - " + map.metadata.songSubName)
            //.setDescription(`${map.difficultyRaw.replaceAll("_", "").replaceAll("SoloStandard", "").replaceAll("ExpertPlus", "Expert Plus")}\n[Download Map](https://beatsaver.com${response.result!.directDownload}) - [Preview Map](https://skystudioapps.com/bs-viewer/?id=${response.result!.key})`)
            .attachFiles(bannerAttachment /* Ignore Error */)
            .setImage('attachment://map.png')
        //.setFooter("Time Set: " + moment(new Date(song.timeSet)).format('MMMM Do YYYY, h:mm:ss a'))
        );
    }
};
