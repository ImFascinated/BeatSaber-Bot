import fs from "fs";

export default class UserData {
	
	private readonly _id: string;
	private _scoreSaberId: string;

	constructor(
		id: string,
		scoreSaberId: string
	) {
		this._id = id;
		this._scoreSaberId = scoreSaberId;
	}

	public save() {
		fs.writeFile(`./user-data/${this._id}.json`, JSON.stringify(this), (err) => {
			if (err) {
				console.warn("Failed to save user data: " + this._id);
			}
		});
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
}