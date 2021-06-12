import Guild from "./Guild";
import fs from 'fs';
import Manager from "../Utils/Manager";
import BSBotClient from "../Client/BSBotClient";
import {promisify} from 'util';
const glob = promisify(require('glob'));

import GuildSchema from "./GuildSchema";

const defaultGuild = {
	prefix: "bs!",
	embedColor: "08DCCF"
}

export default class GuildManager extends Manager {

	private _guilds: Map<String, Guild> = new Map<String, Guild>();
	
	constructor(client: BSBotClient) {
		super(client);
		this.loadGuilds();
		this.setupSaveHandler();
	}

	private async loadGuilds() {
		const guilds = await GuildSchema.find().exec();
		if (!guilds) {
			super.logger.log("No guilds to load!");
			return;
		}

		for (const guild of guilds) {
			const id = guild._id;
			const prefix = guild.prefix;
			const embedColor = guild.embedColor;

			this._guilds.set(
				id,
				new Guild(
					id,
					prefix,
					embedColor
				)
			);
		}
		super.logger.log(`Loaded ${guilds.length} guilds.`);
	}
	
	public async loadGuild(id: string): Promise<Guild> {
		const guildData = await GuildSchema.find({ _id: id }).exec();

		const prefix = guildData.prefix;
		const embedColor = guildData.embedColor;

		const guild = new Guild(
			id,
			prefix,
			embedColor
		);
		this._guilds.set(id, guild);
		return guild;
	}

	async createGuild(id: string) {
		if (!this.guildExists(id)) {
			await GuildSchema.create(
				{
					_id: id,
					prefix: defaultGuild.prefix,
					embedColor: defaultGuild.embedColor,
				}
			);
			const guild = new Guild(
				id,
				defaultGuild.prefix,
				defaultGuild.embedColor
			);
			this._guilds.set(id, guild);
		}
	}
	
	private setupSaveHandler() {
		setInterval(async () => {
			await this.saveData();
		}, 300000); // 5 Mins
	}

	public async saveData() {
		for (let guild of this._guilds) {
			const guildSettings = guild[1];
			const guildData = await GuildSchema.findOne({ _id: guildSettings.id }).exec();

			guildData.prefix = guildSettings.prefix;
			guildData.embedColor = guildSettings.embedColor;
			guildData.save();
		}
		super.log("Saved guild data!");
	}
	
	public getGuild(id: String): Guild | undefined {
		return this._guilds.get(id);
	}

	private guildExists(id: string): boolean {
		return this._guilds.has(id);
	}

	get guilds(): Map<String, Guild> {
		return this._guilds;
	}
}