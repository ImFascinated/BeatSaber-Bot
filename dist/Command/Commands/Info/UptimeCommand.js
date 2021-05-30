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
module.exports = class UptimeCommand extends Command_1.default {
    constructor() {
        super("uptime", {
            description: "Shows the bots uptime",
            category: "info"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;
        await channel.send(`Uptime: **${instance.utils.formatTime(process.uptime() * 1000)}**`);
    }
};
