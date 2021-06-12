"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const UserDataManager_1 = __importDefault(require("../UserData/UserDataManager"));
const BeatSaberManager_1 = __importDefault(require("../BeatSaber/BeatSaberManager"));
const Mongo_1 = __importStar(require("../Utils/Mongo"));
const Events_1 = __importDefault(require("../Enums/Events"));
class BatClient extends discord_js_1.Client {
    constructor(config) {
        super();
        this._token = "";
        this._version = "0.7.0";
        this._embedFooter = "Created by Fascinated#4735 v" + this._version;
        this._mongoConnection = null;
        this._token = config.discord.token;
        this._client = this;
        this._utils = new Utils_1.default();
        this._logger = new Logger_1.default("[BS Bot]:");
        this._guildManager = new GuildManager_1.default(this);
        this._userDataManager = new UserDataManager_1.default(this);
        this._commandManager = new CommandManager_1.default(this);
        this._eventManager = new EventManager_1.default(this);
        this._beatSaberManager = new BeatSaberManager_1.default(this);
        setTimeout(async () => {
            if (config.mongo.connectionString) {
                await Mongo_1.default(config.mongo.connectionString, this, {});
                this._mongoConnection = Mongo_1.getMongoConnection();
            }
            else {
                this._logger.warn("No MongoDB connection URI provided.");
                this.emit(Events_1.default.DATABASE_CONNECTED, null, "");
            }
        }, 0);
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
