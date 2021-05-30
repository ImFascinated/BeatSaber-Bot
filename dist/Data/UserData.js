"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class UserData {
    constructor(id, scoreSaberId, lastScore, scoreFeedChannelId) {
        this._id = id;
        this._scoreSaberId = scoreSaberId;
        this._lastScore = lastScore;
        this._scoreFeedChannelId = scoreFeedChannelId;
    }
    save() {
        fs_1.default.writeFile(`./user-data/${this._id}.json`, JSON.stringify(this), (err) => {
            if (err) {
                console.warn("Failed to save user data: " + this._id);
            }
        });
    }
    get id() {
        return this._id;
    }
    get scoreSaberId() {
        return this._scoreSaberId;
    }
    set scoreSaberId(value) {
        this._scoreSaberId = value;
    }
    get lastScore() {
        return this._lastScore;
    }
    set lastScore(value) {
        this._lastScore = value;
    }
    get scoreFeedChannelId() {
        return this._scoreFeedChannelId;
    }
    set scoreFeedChannelId(value) {
        this._scoreFeedChannelId = value;
    }
}
exports.default = UserData;
