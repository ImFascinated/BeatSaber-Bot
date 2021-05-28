import Guild from "./Guild";
import fs from 'fs';
import Manager from "../Utils/Manager";
import BatClient from "../Client/BatClient";
import {promisify} from 'util';
const glob = promisify(require('glob'));

const defaultGuild = {
	prefix: "bs!"
}

export default class GuildManager extends Manager {

	private _guilds: Map<String, Guild> = new Map<String, Guild>();
	
	constructor(client: BatClient) {
		super(client);
		this.loadGuilds();
		this.setupSaveHandler();
	}

	private loadGuilds() {
		return glob(`./guilds/*.json`).then(async (guilds: any[]) => {
			for (const g of guilds) {
				const guildFile = fs.readFileSync(g);
				if (!guildFile) {
					super.logger.warn(`Failed to load guild ${g}.`)
					continue;
				}
				const guild: Guild = await this.loadGuild(JSON.parse(guildFile.toString()));
				this._guilds.set(guild.id, guild);
			}
			if (this._guilds.size > 0) {
				super.logger.log(`Loaded ${this._guilds.size} guild${this._guilds.size > 1 ? 's' : ''}.`)
			} else {
				super.logger.log("No guilds have been loaded.");
			}
		});
	}
	
	async loadGuild(json: JSON): Promise<Guild> {
		const id: string = json._id;
		const prefix: string = json._prefix || defaultGuild.prefix;

		return new Guild(
			id,
			prefix
		);
	}

	async createGuild(id: string) {
		if (!this.guildExists(id)) {
			const guild: Guild = new Guild(id, defaultGuild.prefix);

			fs.exists('./guilds', (exists: boolean) => {
				if (!exists) {
					fs.mkdir(`./guilds`, (err) => { if (err) super.logger.log("Failed to create guilds directory") });
				}
			});
			fs.writeFile(`./guilds/${id}.json`, JSON.stringify(guild), (err) => {
				if (err) {
					super.logger.log("Failed to create guild: " + id);
				}
			});

			super.logger.log(`Created guild ${id}.`);
			this._guilds.set(id, guild);
		}
	}
	
	private setupSaveHandler() {
		setInterval(() => {
			for (const guild of this._guilds.values()) {
				guild.save();
			}
		}, 60 * 60 * 5); // 5 Mins
	}
	
	public getGuild(id: String): Guild | undefined {
		return this._guilds.get(id);
	}

	private guildExists(id: string): boolean {
		return this._guilds.has(id);
	}
}