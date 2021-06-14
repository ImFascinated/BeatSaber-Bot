/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 12/06/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import Discord, {MessageEmbed} from "discord.js";

module.exports = class MapCommand extends Command {
    constructor() {
        super("map", {
            category: "beatsaber",
            description: "Get information about a map",
            usage: "[map key]"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const userData = commandArguments.userData;
        const args = commandArguments.args;
        const guildSettings = commandArguments.guildSettings;

        const map = await super.instance.beatSaberManager.fetchMapInfo(args[0]);
        if (map == null) {
            await channel.send("Unknown map");
            return;
        }

        const banner: Buffer = await super.instance.beatSaberManager.createMapInfo(map);
        const bannerAttachment = new Discord.MessageAttachment(banner, 'map.png');
        await channel.send(new MessageEmbed()
            .setColor(`#${guildSettings.embedColor}`)
            .setTimestamp()
            .setTitle(map.metadata.songName + " - " + map.metadata.songSubName)
            //.setDescription(`${map.difficultyRaw.replaceAll("_", "").replaceAll("SoloStandard", "").replaceAll("ExpertPlus", "Expert Plus")}\n[Download Map](https://beatsaver.com${response.result!.directDownload}) - [Preview Map](https://skystudioapps.com/bs-viewer/?id=${response.result!.key})`)
            .attachFiles(bannerAttachment /* Ignore Error */)
            .setImage('attachment://map.png')
            //.setFooter("Time Set: " + moment(new Date(song.timeSet)).format('MMMM Do YYYY, h:mm:ss a'))
        );
    }
}