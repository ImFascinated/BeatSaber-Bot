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
module.exports = class LinkCommand extends Command_1.default {
    constructor() {
        super("link", {
            category: "beatsaber",
            description: "Link your scoresaber account to the bot",
            usage: "(scoresaber link)"
        });
    }
    async execute(commandArguments) {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        if (userData.scoreSaberId !== "") {
            await channel.send("You already have a scoresaber account linked.");
            return;
        }
        let id = "";
        if (isNaN(Number.parseInt(args[0]))) {
            const match = args[0].match(/\d+/g);
            if (!match) {
                await channel.send("That is not a valid scoresaber link.");
                return;
            }
            id = match[0];
        }
        else {
            id = args[0];
        }
        userData.scoreSaberId = id;
        await channel.send("Successfully linked your scoresaber account.");
    }
};
