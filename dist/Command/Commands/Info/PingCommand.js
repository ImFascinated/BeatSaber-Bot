"use strict";
/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = __importDefault(require("../../Command"));
module.exports = class PingCommand extends Command_1.default {
    constructor() {
        super("ping", {
            description: "Retrieves the response time of the bot",
            category: "info"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const before = Date.now();
        const msg = await channel.send("Pinging...");
        await msg.edit(`Ping! \`${Date.now() - before}ms\``);
    }
};
