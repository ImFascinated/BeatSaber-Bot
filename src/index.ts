import Client from './Client/BatClient';
const config = require('../config.json');

new Client(config.discord.token);