/**
 * Project: BeatSaber Bot
 * Created by Fascinated#4735 on 28/05/2021
 */

export interface MapDifficulty {
    difficulties: {
        easy: {
            duration: number
            length: number
            njs: number
            njsOffset: number
            bombs: number
            notes: number
            obstacles: number
        }
        normal: {
            duration: number
            length: number
            njs: number
            njsOffset: number
            bombs: number
            notes: number
            obstacles: number
        }
        hard: {
            duration: number
            length: number
            njs: number
            njsOffset: number
            bombs: number
            notes: number
            obstacles: number
        }
        expert: {
            duration: number
            length: number
            njs: number
            njsOffset: number
            bombs: number
            notes: number
            obstacles: number
        }
        expertPlus: {
            duration: number
            length: number
            njs: number
            njsOffset: number
            bombs: number
            notes: number
            obstacles: number
        }
    }
}