﻿/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../../Command";
import ICommandArguments from "../../ICommandArguments";

module.exports = class ForceSaveDataCommand extends Command {
    constructor() {
        super("forcesavedata", {
            description: "Saves all data..",
            aliases: [
                "fs",
                "forcesave",
                "fsd"
            ],
            botOwnerOnly: true,
            category: "admin"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;

        const msg = await channel.send("Saving users...")
        for (const userData of instance.userDataManager.users.values()) {
            userData.save();
        }
        await msg.edit("Saved users!")

        for (const guilds of instance.guildManager.guilds.values()) {
            guilds.save();
        }
        await msg.edit("Saved users & guilds!")
    }
}