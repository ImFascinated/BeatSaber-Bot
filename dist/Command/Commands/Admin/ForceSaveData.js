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
module.exports = class ForceSaveDataCommand extends Command_1.default {
    constructor() {
        super("forcesavedata", {
            description: "Saves all data..",
            aliases: [
                "fs",
                "forcesave",
                "fsd"
            ],
            botOwnerOnly: true,
            category: "admin"
        });
    }
    async execute(commandArguments) {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;
        const msg = await channel.send("Saving users...");
        await instance.userDataManager.saveData();
        await msg.edit("Saved users!");
        await instance.guildManager.saveData();
        await msg.edit("Saved users & guilds!");
    }
};
