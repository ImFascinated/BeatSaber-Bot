"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserData {
    constructor(id, scoreSaberId, lastScore, scoreFeedChannelId) {
        this._id = id;
        this._scoreSaberId = scoreSaberId;
        this._lastScore = lastScore;
        this._scoreFeedChannelId = scoreFeedChannelId;
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
