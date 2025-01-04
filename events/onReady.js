const { Events } = require("discord.js");
const { info } = require("../utils/Console")

module.exports = {
	name: Events.ClientReady,
	once: true,

	/**
	 * @description Executes when client is ready (bot initialization).
	 * @param {import('../typings').Client} client Main Application Client.
	 */
	execute(client) {
		info(`Ready! Logged in as ${client.user.tag}`);
	},
};