import fs from "fs";

export default class Guild {
	private readonly _id: string;

	private _prefix: string;
	private _embedColor: string;

	constructor(
		id: string,
		prefix: string,
		embedColor: string
	) {
		this._id = id;
		this._prefix = prefix;
		this._embedColor = embedColor;
	}

	public save() {
		fs.writeFile(`./guilds/${this._id}.json`, JSON.stringify(this), (err) => {
			if (err) {
				console.warn("Failed to save guild: " + this._id);
			}
		});
	}

	get id() {
		return this._id;
	}


	get prefix(): string {
		return this._prefix;
	}

	set prefix(value: string) {
		this._prefix = value;
	}

	get embedColor(): string {
		return this._embedColor;
	}

	set embedColor(value: string) {
		this._embedColor = value;
	}
}