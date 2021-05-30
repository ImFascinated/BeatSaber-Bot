"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const path_1 = __importDefault(require("path"));
const Event_1 = __importDefault(require("./Event"));
const Manager_1 = __importDefault(require("../Utils/Manager"));
const glob = util_1.promisify(require('glob'));
class EventManager extends Manager_1.default {
    constructor(instance) {
        super(instance);
        this._events = new Map();
        this.init(instance, instance.client);
    }
    init(instance, client, silentLoad) {
        return glob(`${__dirname}\\Events\\**\\*.js`).then((events) => {
            for (const eventFile of events) {
                delete require.cache[eventFile];
                const { name } = path_1.default.parse(eventFile);
                const File = require(eventFile);
                if (!instance.utils.isClass(File))
                    throw new TypeError(`Event ${name} doesn't export a class!`);
                const event = new File(client, name);
                if (!(event instanceof Event_1.default))
                    throw new TypeError(`Event ${name} does not extend EventBase`);
                if (name === undefined)
                    continue;
                this.registerEvent(instance, client, event, name);
            }
            if (!silentLoad) {
                if (this._events.size > 0) {
                    super.logger.log(`Loaded ${this._events.size} event${this._events.size > 1 ? 's' : ''}.`);
                }
            }
        });
    }
    registerEvent(instance, client, event, name) {
        if (!event.event) {
            throw new Error(`Event ${name} does not have an event type, therefore it cannot run.`);
        }
        this._events.set(event.event, event);
        client[event.type](event.event, (...args) => {
            event.execute(instance, client, ...args);
        });
    }
}
exports.default = EventManager;
