/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */
import {MapDifficulty} from "./MapDifficulty";

export interface MapMetadata {
    characteristics: MapDifficulty[]
    duration: number,
    automapper: any,
    levelAuthorName: string,
    songAuthorName: string,
    songName: string,
    songSubName: string,
    bpm: number
}