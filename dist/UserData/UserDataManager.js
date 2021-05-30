"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Manager_1 = __importDefault(require("../Utils/Manager"));
const util_1 = require("util");
const UserData_1 = __importDefault(require("./UserData"));
const UserDataSchema_1 = __importDefault(require("./UserDataSchema"));
const glob = util_1.promisify(require('glob'));
class UserDataManager extends Manager_1.default {
    constructor(client) {
        super(client);
        this._users = new Map();
        this.loadUsersData();
        this.setupSaveHandler();
    }
    async loadUsersData() {
        const users = await UserDataSchema_1.default.find().exec();
        if (!users) {
            super.logger.log("No users to load!");
            return;
        }
        for (const user of users) {
            const id = user._id;
            const scoreSaberId = user.scoreSaberId;
            const lastScore = user.lastScore;
            const scoreFeedChannelId = user.scoreFeedChannelId;
            this._users.set(id, new UserData_1.default(id, scoreSaberId, lastScore, scoreFeedChannelId));
        }
        super.logger.log(`Loaded ${users.length} users.`);
    }
    async loadUserData(id) {
        const userData = await UserDataSchema_1.default.find({ _id: id }).exec();
        const scoreSaberId = userData.scoreSaberId;
        const lastScore = userData.lastScore;
        const scoreFeedChannelId = userData.scoreFeedChannelId;
        const user = new UserData_1.default(id, scoreSaberId, lastScore, scoreFeedChannelId);
        this._users.set(id, user);
        return user;
    }
    async createUserData(id) {
        if (!this.userDataExists(id)) {
            await UserDataSchema_1.default.create({
                _id: id,
                scoreSaberId: "",
                lastScore: { scoreId: -1 },
                scoreFeedChannelId: ""
            });
            const user = new UserData_1.default(id, "", { scoreId: -1 }, "");
            this._users.set(id, user);
        }
    }
    setupSaveHandler() {
        setInterval(async () => {
            for (let userr of this._users) {
                const userData = userr[1];
                const user = await UserDataSchema_1.default.findOne({ _id: userData.id }).exec();
                user.scoreSaberId = userData.scoreSaberId;
                user.lastScore = userData.lastScore;
                user.scoreFeedChannelId = userData.scoreFeedChannelId;
                user.save();
            }
        }, 60 * 60 * 5 * 1000); // 5 Mins
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
