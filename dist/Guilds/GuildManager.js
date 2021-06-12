"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Guild_1 = __importDefault(require("./Guild"));
const Manager_1 = __importDefault(require("../Utils/Manager"));
const util_1 = require("util");
const glob = util_1.promisify(require('glob'));
const GuildSchema_1 = __importDefault(require("./GuildSchema"));
const defaultGuild = {
    prefix: "bs!",
    embedColor: "08DCCF"
};
class GuildManager extends Manager_1.default {
    constructor(client) {
        super(client);
        this._guilds = new Map();
        this.loadGuilds();
        this.setupSaveHandler();
    }
    async loadGuilds() {
        const guilds = await GuildSchema_1.default.find().exec();
        if (!guilds) {
            super.logger.log("No guilds to load!");
            return;
        }
        for (const guild of guilds) {
            const id = guild._id;
            const prefix = guild.prefix;
            const embedColor = guild.embedColor;
            this._guilds.set(id, new Guild_1.default(id, prefix, embedColor));
        }
        super.logger.log(`Loaded ${guilds.length} guilds.`);
    }
    async loadGuild(id) {
        const guildData = await GuildSchema_1.default.find({ _id: id }).exec();
        const prefix = guildData.prefix;
        const embedColor = guildData.embedColor;
        const guild = new Guild_1.default(id, prefix, embedColor);
        this._guilds.set(id, guild);
        return guild;
    }
    async createGuild(id) {
        if (!this.guildExists(id)) {
            await GuildSchema_1.default.create({
                _id: id,
                prefix: defaultGuild.prefix,
                embedColor: defaultGuild.embedColor,
            });
            const guild = new Guild_1.default(id, defaultGuild.prefix, defaultGuild.embedColor);
            this._guilds.set(id, guild);
        }
    }
    setupSaveHandler() {
        setInterval(async () => {
            await this.saveData();
        }, 300000); // 5 Mins
    }
    async saveData() {
        for (let guild of this._guilds) {
            const guildSettings = guild[1];
            const guildData = await GuildSchema_1.default.findOne({ _id: guildSettings.id }).exec();
            guildData.prefix = guildSettings.prefix;
            guildData.embedColor = guildSettings.embedColor;
            guildData.save();
        }
        super.log("Saved guild data!");
    }
    getGuild(id) {
        return this._guilds.get(id);
    }
    guildExists(id) {
        return this._guilds.has(id);
    }
    get guilds() {
        return this._guilds;
    }
}
exports.default = GuildManager;
