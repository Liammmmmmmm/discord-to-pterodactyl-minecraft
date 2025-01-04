const { success, info, warn, error, debug} = require("./utils/Console");
const DatabaseConnection = require("./utils/SQLRequest");
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: './.env'});
const DiscordBot = require('./client/DiscordBot');

fs.writeFileSync('./terminal.log', '', 'utf-8');

const client = new DiscordBot();

module.exports = client;

client.connect();

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);