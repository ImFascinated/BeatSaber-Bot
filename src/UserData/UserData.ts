import fs from "fs";
import {LastScore} from "./LastScore";

export default class UserData {
	
	private readonly _id: string;
	private _scoreSaberId: string;
	private _lastScore: LastScore;
	private _scoreFeedChannelId: string;

	constructor(
		id: string,
		scoreSaberId: string,
		lastScore: LastScore,
		scoreFeedChannelId: string
	) {
		this._id = id;
		this._scoreSaberId = scoreSaberId;
		this._lastScore = lastScore;
		this._scoreFeedChannelId = scoreFeedChannelId;
	}

	get id() {
		return this._id;
	}

	get scoreSaberId(): string {
		return this._scoreSaberId;
	}

	set scoreSaberId(value: string) {
		this._scoreSaberId = value;
	}

	get lastScore(): LastScore {
		return this._lastScore;
	}

	set lastScore(value: LastScore) {
		this._lastScore = value;
	}

	get scoreFeedChannelId(): string {
		return this._scoreFeedChannelId;
	}

	set scoreFeedChannelId(value: string) {
		this._scoreFeedChannelId = value;
	}
}