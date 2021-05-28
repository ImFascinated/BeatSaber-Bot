import { PermissionString } from "discord.js";
import ICommandOptions from "./ICommandOptions";
import ICommandArguments from "./ICommandArguments";
import Guild from "../Guilds/Guild";
import BatClient from "../Client/BatClient";

export default class Command {

	private readonly _name: string;
	private readonly _description: string;
	private readonly _category: string;
	private readonly _aliases: string[];
	private readonly _permissions: PermissionString[];
	private readonly _commandTips: string[];
	
	private _instance: BatClient | undefined;
	private _guild: Guild | undefined; 

	constructor(name: string, options: ICommandOptions) {
		this._name = name;
		
		const {
			description = "",
			category = "",
			aliases = [],
			permissions = [],
			commandTips = []
		} = options
		
		this._description = description;
		this._category = category;
		this._aliases = aliases;
		this._permissions = permissions;
		this._commandTips = commandTips;
	}

	async execute(commandArguments: ICommandArguments) {
		throw new Error(`Command ${this._name} does not provide a execute method.`);
	}
	
	public setInstance(instance: BatClient) {
		this._instance = instance;
	}
	
	public setGuild(guild: Guild) {
		this._guild = guild;
	}

	public getRandomCommandTip(): string {
		return "**TIP:** " + this._commandTips[Math.floor(Math.random() * this._commandTips.length)]
			.replaceAll("%prefix%", this._guild!.prefix);
	}


	get name(): string {
		return this._name;
	}

	get description(): string {
		return this._description;
	}

	get category(): string {
		return this._category;
	}

	get aliases(): string[] {
		return this._aliases;
	}

	get permissions(): PermissionString[] {
		return this._permissions;
	}

	get commandTips(): string[] {
		return this._commandTips;
	}

	get instance(): BatClient {
		return <BatClient>this._instance;
	}

	get guild(): Guild | undefined {
		return this._guild;
	}
}