/**
 * Project: BatBot-NEW
 * Created by Fascinated#4735 on 25/05/2021
 */
import {
    Client, 
    DMChannel,
    Message, 
    NewsChannel,
    TextChannel
} from "discord.js";
import BatClient from "../Client/BSBotClient";
import Guild from "../Guilds/Guild";
import UserData from "../UserData/UserData";

export default interface ICommandArguments {
    channel: TextChannel | DMChannel | NewsChannel;
    message: Message;
    args: string[];
    text: string;
    client: Client;
    prefix: string;
    instance: BatClient;
    guildSettings: Guild;
    userData: UserData;
}