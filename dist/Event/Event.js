"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(options) {
        this._event = '';
        this._type = 'on';
        let { event = '', type = 'on' } = options;
        this._event = event;
        this._type = type;
    }
    execute(instance, ...args) {
        throw new Error(`The event ${this._event} is missing the execute method.`);
    }
    get event() {
        return this._event;
    }
    get type() {
        return this._type;
    }
}
exports.default = Event;
