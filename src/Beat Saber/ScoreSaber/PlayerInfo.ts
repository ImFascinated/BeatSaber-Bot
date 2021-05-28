/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */
import {Badge} from "./Badge";

export interface PlayerInfo {
    playerId: string,
    pp: number,
    banned: boolean,
    inactive: boolean,
    playerName: string,
    country: string,
    role: string,
    badges: Badge[],
    history: string,
    avatar: string,
    rank: number,
    countryRank: number
}