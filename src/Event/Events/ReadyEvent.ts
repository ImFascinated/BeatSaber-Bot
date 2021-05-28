/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */

import Event from "../Event";
import BatClient from "../../Client/BatClient";

module.exports = class ReadyEvent extends Event {
    constructor() {
        super({
            event: 'ready'
        });
    }

    async execute(instance: BatClient) {
        instance.logger.log("Ready!");
        
        await instance.client.user!.setActivity({name: "?help | v" + instance.version, type: "PLAYING"})
    }
}