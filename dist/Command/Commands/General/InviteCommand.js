"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Command"));
module.exports = class InviteCommand extends Command_1.default {
    constructor() {
        super("invite", {
            description: "Sends the bot's invite",
            category: "general"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        await channel.send("Invite: https://discord.com/oauth2/authorize?client_id=847958793468117032&permissions=8&scope=bot");
    }
};
