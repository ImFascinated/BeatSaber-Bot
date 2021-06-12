/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */
import BSBotClient from "../Client/BSBotClient";
import {promisify} from 'util';
import path from "path";
import {Client} from "discord.js";
import Event from "./Event";
import Manager from "../Utils/Manager";
const glob = promisify(require('glob'));

export default class EventManager extends Manager {
    private _events: Map<String, Event> = new Map();

    constructor(instance: BSBotClient) {
        super(instance);
        this.init(instance, instance.client);
    }

    private init(instance: BSBotClient, client: Client, silentLoad?: boolean) {
        return glob(`${__dirname}${path.sep}Events${path.sep}**${path.sep}*.js`).then((events: any[]) => {
            for (const eventFile of events) {
                delete require.cache[eventFile];
                const { name } = path.parse(eventFile);
                const File = require(eventFile);
                if (!instance.utils.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
                const event = new File(client, name);
                if (!(event instanceof Event)) throw new TypeError(`Event ${name} does not extend EventBase`);
                if (name === undefined) continue;
                this.registerEvent(instance, client, event, name);
            }
            if (!silentLoad) {
                if (this._events.size > 0) {
                    super.logger.log(`Loaded ${this._events.size} event${this._events.size > 1 ? 's' : ''}.`);
                }
            }
        });
    }

    public registerEvent(instance: BSBotClient, client: any, event: Event, name: string) {
        if (!event.event) {
            throw new Error(`Event ${name} does not have an event type, therefore it cannot run.`);
        }

        this._events.set(event.event, event);
        client[event.type](event.event, (...args: any) => {
            event.execute(instance, client, ...args)
        });
    }
}