/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 28/05/2021
 */

export default interface Score {
	scoreId: number,
	leaderboardId: number,
	score: number,
	uScore: number,
	mods: string,
	playerId: string,
	timeSet: string,
	pp: number,
	weight: number,
	id: string,
	songName: string,
	songSubName: string,
	songAuthorName: string,
	levelAuthorName: string,
	difficulty: string,
	difficultyRaw: string,
	maxScore: number,
	rank: number,
	songHash: string
}