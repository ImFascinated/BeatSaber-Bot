"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Manager_1 = __importDefault(require("../Utils/Manager"));
const util_1 = require("util");
const UserData_1 = __importDefault(require("./UserData"));
const glob = util_1.promisify(require('glob'));
class UserDataManager extends Manager_1.default {
    constructor(client) {
        super(client);
        this._users = new Map();
        this.loadUsersData();
        this.setupSaveHandler();
    }
    loadUsersData() {
        return glob(`./user-data/*.json`).then(async (guilds) => {
            for (const g of guilds) {
                const userDataFile = fs_1.default.readFileSync(g);
                if (!userDataFile) {
                    super.logger.warn(`Failed to load user ${g}.`);
                    continue;
                }
                const user = await this.loadUserData(JSON.parse(userDataFile.toString()));
                this._users.set(user.id, user);
            }
            if (this._users.size > 0) {
                super.logger.log(`Loaded ${this._users.size} user${this._users.size > 1 ? 's' : ''}.`);
            }
            else {
                super.logger.log("No users have been loaded.");
            }
        });
    }
    async loadUserData(json) {
        const id = json._id;
        const scoreSaberId = json._scoreSaberId || "";
        const lastScore = json._lastScore || { scoreId: -1 };
        const scoreFeedChannelId = json._scoreFeedChannelId || "";
        return new UserData_1.default(id, scoreSaberId, lastScore, scoreFeedChannelId);
    }
    async createUserData(id) {
        if (!this.userDataExists(id)) {
            const user = new UserData_1.default(id, "", {
                scoreId: -1
            }, "");
            fs_1.default.exists('./user-data', (exists) => {
                if (!exists) {
                    fs_1.default.mkdir(`./user-data`, (err) => { if (err)
                        super.logger.log("Failed to create user-data directory"); });
                }
            });
            fs_1.default.writeFile(`./user-data/${id}.json`, JSON.stringify(user), (err) => {
                if (err) {
                    super.logger.log("Failed to create user: " + id);
                }
            });
            super.logger.log(`Created user ${id}.`);
            this._users.set(id, user);
        }
    }
    setupSaveHandler() {
        setInterval(() => {
            for (const userData of this._users.values()) {
                userData.save();
            }
        }, 60 * 60 * 5); // 5 Mins
    }
    getUserData(id) {
        return this._users.get(id);
    }
    userDataExists(id) {
        return this._users.has(id);
    }
    get users() {
        return this._users;
    }
}
exports.default = UserDataManager;
