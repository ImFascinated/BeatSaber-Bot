"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Guild {
    constructor(id, prefix, embedColor) {
        this._id = id;
        this._prefix = prefix;
        this._embedColor = embedColor;
    }
    get id() {
        return this._id;
    }
    get prefix() {
        return this._prefix;
    }
    set prefix(value) {
        this._prefix = value;
    }
    get embedColor() {
        return this._embedColor;
    }
    set embedColor(value) {
        this._embedColor = value;
    }
}
exports.default = Guild;
