import Client from './Client/BSBotClient';
const config = require('../config.json');

new Client(config.discord.token, config.mongo.connectionString);