"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BSBotClient_1 = __importDefault(require("./Client/BSBotClient"));
const config = require('../config.json');
new BSBotClient_1.default(config.discord.token, config.mongo.connectionString);
