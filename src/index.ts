import Client from './Client/BatClient';
import config from './config.json';

new Client(config.discord.token);