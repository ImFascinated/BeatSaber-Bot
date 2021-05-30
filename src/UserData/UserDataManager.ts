import fs from 'fs';
import Manager from "../Utils/Manager";
import BSBotClient from "../Client/BSBotClient";
import {promisify} from 'util';
import UserData from "./UserData";
import {LastScore} from "./LastScore";
import Guild from "../Guilds/Guild";
import UserDataSchema from "./UserDataSchema";
import GuildSchema from "../Guilds/GuildSchema";
const glob = promisify(require('glob'));

export default class UserDataManager extends Manager {

	private _users: Map<String, UserData> = new Map<String, UserData>();
	
	constructor(client: BSBotClient) {
		super(client);
		this.loadUsersData();
		this.setupSaveHandler();
	}

	private async loadUsersData() {
		const users = await UserDataSchema.find().exec();
		if (!users) {
			super.logger.log("No users to load!");
			return;
		}

		for (const user of users) {
			const id = user._id;
			const scoreSaberId = user.scoreSaberId;
			const lastScore = user.lastScore;
			const scoreFeedChannelId = user.scoreFeedChannelId;

			this._users.set(
				id,
				new UserData(
					id,
					scoreSaberId,
					lastScore,
					scoreFeedChannelId
				)
			);
		}
		super.logger.log(`Loaded ${users.length} users.`);
	}
	
	async loadUserData(id: string): Promise<UserData> {
		const userData = await UserDataSchema.find({ _id: id }).exec();

		const scoreSaberId = userData.scoreSaberId;
		const lastScore = userData.lastScore;
		const scoreFeedChannelId = userData.scoreFeedChannelId;

		const user = new UserData(
			id,
			scoreSaberId,
			lastScore,
			scoreFeedChannelId
		)
		this._users.set(id, user);
		return user;
	}

	async createUserData(id: string) {
		if (!this.userDataExists(id)) {
			await UserDataSchema.create(
				{
					_id: id,
					scoreSaberId: "",
					lastScore: { scoreId: -1 },
					scoreFeedChannelId: ""
				}
			);
			const user = new UserData(
				id,
				"",
				{ scoreId: -1 },
				""
			)
			this._users.set(id, user);
		}
	}
	
	private setupSaveHandler() {
		setInterval(async () => {
			for (let userr of this._users) {
				const userData = userr[1];
				const user = await UserDataSchema.findOne({ _id: userData.id }).exec();

				user.scoreSaberId = userData.scoreSaberId;
				user.lastScore = userData.lastScore;
				user.scoreFeedChannelId = userData.scoreFeedChannelId;
				user.save();
			}
		}, 60 * 60 * 5 * 1000); // 5 Mins
	}
	
	public getUserData(id: String): UserData | undefined {
		return this._users.get(id);
	}

	private userDataExists(id: string): boolean {
		return this._users.has(id);
	}

	get users(): Map<String, UserData> {
		return this._users;
	}
}