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
module.exports = class UnLinkCommand extends Command_1.default {
    constructor() {
        super("unlink", {
            category: "beatsaber",
            description: "Unlink your scoresaber account"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        if (userData.scoreSaberId == "") {
            await channel.send("You do not have a scoresaber account linked.");
            return;
        }
        userData.scoreSaberId = "";
        await channel.send("Successfully unlinked your scoresaber account.");
    }
};
