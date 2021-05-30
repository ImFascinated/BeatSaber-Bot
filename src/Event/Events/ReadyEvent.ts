/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 26/05/2021
 */

import Event from "../Event";
import BSBotClient from "../../Client/BSBotClient";

module.exports = class ReadyEvent extends Event {
    constructor() {
        super({
            event: 'ready'
        });
    }

    async execute(instance: BSBotClient) {
        instance.logger.log("Ready!");
        
        await instance.client.user!.setActivity({name: "bs!help | v" + instance.version, type: "PLAYING"})
    }
}