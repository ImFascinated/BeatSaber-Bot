"use strict";
/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Event_1 = __importDefault(require("../Event"));
module.exports = class ReadyEvent extends Event_1.default {
    constructor() {
        super({
            event: 'ready'
        });
    }
    async execute(instance) {
        instance.logger.log("Ready!");
        await instance.client.user.setActivity({ name: "bs!help | v" + instance.version, type: "PLAYING" });
    }
};
