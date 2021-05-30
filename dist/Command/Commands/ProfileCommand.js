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
        super("profile", {
            category: "beatsaber",
            description: "Check your score saber profile"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }
        const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
        if (player == null) {
            await channel.send("Unable to fetch your score saber profile...");
            return;
        }
        const header = await super.instance.beatSaberManager.createProfileImage(player);
        const headerAttachment = new discord_js_1.default.MessageAttachment(header, 'profile.png');
        await channel.send(headerAttachment);
    }
};
