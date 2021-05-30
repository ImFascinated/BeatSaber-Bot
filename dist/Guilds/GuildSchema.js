"use strict";
/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 30/05/2021
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = new mongoose_1.default.Schema({
    _id: String,
    prefix: String,
    embedColor: String
});
exports.default = mongoose_1.default.model('guilds', Schema);
