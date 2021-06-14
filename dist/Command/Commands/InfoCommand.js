"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 12/06/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../Command"));
module.exports = class InfoCommand extends Command_1.default {
    constructor() {
        super("info", {
            category: "beatsaber",
            description: "Information about you [NOT MADE YET <33]"
        });
    }
    async execute(commandArguments) {
        const args = commandArguments.args;
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        await channel.send("Not currently made :3");
    }
};
