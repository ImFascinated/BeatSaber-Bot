import fs from 'fs';
import Manager from "../Utils/Manager";
import BatClient from "../Client/BatClient";
import {promisify} from 'util';
import UserData from "./UserData";
import {LastScore} from "./LastScore";
const glob = promisify(require('glob'));

export default class UserDataManager extends Manager {

	private _users: Map<String, UserData> = new Map<String, UserData>();
	
	constructor(client: BatClient) {
		super(client);
		this.loadUsersData();
		this.setupSaveHandler();
	}

	private loadUsersData() {
		return glob(`./user-data/*.json`).then(async (guilds: any[]) => {
			for (const g of guilds) {
				const userDataFile = fs.readFileSync(g);
				if (!userDataFile) {
					super.logger.warn(`Failed to load user ${g}.`)
					continue;
				}
				const user: UserData = await this.loadUserData(JSON.parse(userDataFile.toString()));
				this._users.set(user.id, user);
			}
			if (this._users.size > 0) {
				super.logger.log(`Loaded ${this._users.size} user${this._users.size > 1 ? 's' : ''}.`)
			} else {
				super.logger.log("No users have been loaded.");
			}
		});
	}
	
	async loadUserData(json: JSON): Promise<UserData> {
		const id: string = json._id;
		const scoreSaberId: string = json._scoreSaberId || "";
		const lastScore: LastScore = json._lastScoreId || "";
		const scoreFeedChannelId: string = json._scoreFeedChannelId || "";

		return new UserData(
			id,
			scoreSaberId,
			lastScore,
			scoreFeedChannelId
		);
	}

	async createUserData(id: string) {
		if (!this.userDataExists(id)) {
			const user: UserData = new UserData(
				id,
				"",
				{
					scoreId: -1
				},
				""
			);

			fs.exists('./user-data', (exists: boolean) => {
				if (!exists) {
					fs.mkdir(`./user-data`, (err) => { if (err) super.logger.log("Failed to create user-data directory") });
				}
			});
			fs.writeFile(`./user-data/${id}.json`, JSON.stringify(user), (err) => {
				if (err) {
					super.logger.log("Failed to create user: " + id);
				}
			});

			super.logger.log(`Created user ${id}.`);
			this._users.set(id, user);
		}
	}
	
	private setupSaveHandler() {
		setInterval(() => {
			for (const userData of this._users.values()) {
				userData.save();
			}
		}, 60 * 60 * 5); // 5 Mins
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