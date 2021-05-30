"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const GuildManager_1 = __importDefault(require("../Guilds/GuildManager"));
const Logger_1 = __importDefault(require("../Utils/Logger"));
const CommandManager_1 = __importDefault(require("../Command/CommandManager"));
const Utils_1 = __importDefault(require("../Utils/Utils"));
const EventManager_1 = __importDefault(require("../Event/EventManager"));
const UserDataManager_1 = __importDefault(require("../Data/UserDataManager"));
const BeatSaberManager_1 = __importDefault(require("../BeatSaber/BeatSaberManager"));
class BatClient extends discord_js_1.Client {
    constructor(token) {
        super();
        this._token = "";
        this._version = "0.6.1";
        this._embedFooter = "Created by Fascinated#4735 v" + this._version;
        this._token = token;
        this._client = this;
        this._utils = new Utils_1.default();
        this._logger = new Logger_1.default("[BS Bot]:");
        this._guildManager = new GuildManager_1.default(this);
        this._userDataManager = new UserDataManager_1.default(this);
        this._commandManager = new CommandManager_1.default(this);
        this._eventManager = new EventManager_1.default(this);
        this._beatSaberManager = new BeatSaberManager_1.default(this);
        this.load();
    }
    load() {
        if (!this.validate()) {
            process.exit(1);
        }
        super.login(this._token).then(() => this._logger.log("Processing login..."));
    }
    validate() {
        const unset = [];
        if (!this._token || this._token == "") {
            unset.push("TOKEN");
        }
        if (unset.length > 0) {
            this._logger.log(`The following properties in config.json have not been set: ${unset.join(", ")}`);
            return false;
        }
        this._logger.log("All properties of config.json have been validated.");
        return true;
    }
    get embedFooter() {
        return this._embedFooter;
    }
    get version() {
        return this._version;
    }
    get client() {
        return this._client;
    }
    get utils() {
        return this._utils;
    }
    get logger() {
        return this._logger;
    }
    get guildManager() {
        return this._guildManager;
    }
    get userDataManager() {
        return this._userDataManager;
    }
    get commandManager() {
        return this._commandManager;
    }
    get eventManager() {
        return this._eventManager;
    }
    get beatSaberManager() {
        return this._beatSaberManager;
    }
}
exports.default = BatClient;
