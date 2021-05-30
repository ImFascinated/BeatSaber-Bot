"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Manager {
    constructor(instance) {
        this._instance = instance;
    }
    log(message) {
        this._instance.logger.log(message);
    }
    get instance() {
        return this._instance;
    }
    get logger() {
        return this._instance.logger;
    }
}
exports.default = Manager;
