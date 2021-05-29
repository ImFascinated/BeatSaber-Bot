import { PermissionString } from "discord.js";

export default interface iCommandOptions {

	description?: string;
	usage?: string;
	category?: string;
	aliases?: string[];
	permissions?: PermissionString[];
	commandTips?: string[];
	botOwnerOnly?: boolean
}