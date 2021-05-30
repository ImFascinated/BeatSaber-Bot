"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(prefix) {
        this._prefix = "";
        this._prefix = prefix;
    }
    log(message) {
        console.log(`${this._prefix} ${message}`);
    }
    warn(message) {
        console.log(`[!!WARNING!!] ${this._prefix} ${message}`);
    }
}
exports.default = Logger;
