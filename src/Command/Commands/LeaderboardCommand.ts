/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 29/05/2021
 */

import Command from "../Command";
import ICommandArguments from "../ICommandArguments";
import {Player} from "../../BeatSaber/ScoreSaber/Player";
import {MessageEmbed} from "discord.js";
import {PlayerInfo} from "../../BeatSaber/ScoreSaber/PlayerInfo";

module.exports = class LeaderboardCommand extends Command {
    constructor() {
        super("leaderboard", {
            category: "beatsaber",
            description: "Shows you the top 15 people in the global leaderboard"
        });
    }

    async execute(commandArguments: ICommandArguments): Promise<void> {
        const channel = commandArguments.channel;
        const instance = commandArguments.instance;
        const guildSettings = commandArguments.guildSettings;

        const players: PlayerInfo[] = await instance.beatSaberManager.fetchLeaderboard();


        let description = ``;
        for (let i = 0; i < 15; i++) {
            const player = players[i];

            description += `\`#${player.rank}\`. **${player.playerName}** | PP: **${player.pp}** | Country: **${player.country}** :flag_${player.country.toLowerCase()}:\n`;
        }

        await channel.send(new MessageEmbed()
            .setAuthor("Top 15 Global Leaderboard")
            .setColor(`#${guildSettings.embedColor}`)
            .setDescription(description)
            .setFooter(super.instance.embedFooter)
            .setTimestamp()
        );
    }
}