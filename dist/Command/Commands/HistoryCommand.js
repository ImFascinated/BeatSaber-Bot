"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../Command"));
const discord_js_1 = __importDefault(require("discord.js"));
module.exports = class HistoryCommand extends Command_1.default {
    constructor() {
        super("history", {
            category: "beatsaber",
            description: "Shows you your previous rank over 50 days"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        const instance = commandArguments.instance;
        if (userData.scoreSaberId == "") {
            await channel.send("You have not linked your scoresaber account.");
            return;
        }
        const player = await super.instance.beatSaberManager.getPlayer(userData.scoreSaberId);
        if (!player)
            return;
        const rankHistoryImage = await instance.beatSaberManager.createRankHistory(player);
        const historyAttachment = new discord_js_1.default.MessageAttachment(rankHistoryImage, 'history.png');
        await channel.send(historyAttachment);
    }
};
