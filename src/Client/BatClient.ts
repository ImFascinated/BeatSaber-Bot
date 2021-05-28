import { Client } from "discord.js";
import GuildManager from "../Guilds/GuildManager";
import Logger from "../Utils/Logger";
import CommandManager from "../Command/CommandManager";
import Utils from "../Utils/Utils";
import EventManager from "../Event/EventManager";
import UserDataManager from "../Data/UserDataManager";
import BeatSaberManager from "../Beat Saber/BeatSaberManager";

export default class BatClient extends Client {

	private readonly _token: string = "";

	private readonly _version: string = "0.2.0";
	private readonly _client: Client;
	private readonly _utils: Utils;
	private readonly _logger: Logger;
	private readonly _guildManager: GuildManager;
	private readonly _userDataManager: UserDataManager;
	private readonly _commandManager: CommandManager;
	private readonly _eventManager: EventManager;
	private readonly _beatSaberManager: BeatSaberManager;

	constructor(token: string) {
		super();
		this._token = token;
		this._client = this;
		this._utils = new Utils();
		this._logger = new Logger("[Bat]:");
		this._guildManager = new GuildManager(this);
		this._userDataManager = new UserDataManager(this);
		this._commandManager = new CommandManager(this);
		this._eventManager = new EventManager(this);
		this._beatSaberManager = new BeatSaberManager(this);

		this.load();
	}

	private load() {
		if (!this.validate()) {
			process.exit(1);
		}
		super.login(this._token).then(() => this._logger.log("Processing login..."))
	}

	public validate(): boolean {
		const unset: string[] = [];
		
		if (!this._token || this._token == "") {
			unset.push("TOKEN");
		}
		if (unset.length > 0) {
			this._logger.log(`The following properties in config.json have not been set: ${unset.join(", ")}`);
			return false;
		}
		this._logger.log("All properties of config.json have been validated.")
		return true;
	}


	get version(): string {
		return this._version;
	}

	get client(): Client {
		return this._client;
	}

	get utils(): Utils {
		return this._utils;
	}

	get logger(): Logger {
		return this._logger;
	}

	get guildManager(): GuildManager {
		return this._guildManager;
	}

	get userDataManager(): UserDataManager {
		return this._userDataManager;
	}

	get commandManager(): CommandManager {
		return this._commandManager;
	}

	get eventManager(): EventManager {
		return this._eventManager;
	}

	get beatSaberManager(): BeatSaberManager {
		return this._beatSaberManager;
	}
}