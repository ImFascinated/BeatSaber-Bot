/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */
import IEventOptions from "./IEventOptions";
import BatClient from "../Client/BatClient";

export default class Event {
    private readonly _event: string = '';
    private readonly _type: string = 'on';

    constructor(options: IEventOptions) {
        let {
            event = '',
            type = 'on'
        } = options;

        this._event = event;
        this._type = type;
    }

    public execute(instance: BatClient, ...args: any) {
        throw new Error(`The event ${this._event} is missing the execute method.`);
    }


    get event(): string {
        return this._event;
    }

    get type(): string {
        return this._type;
    }
}