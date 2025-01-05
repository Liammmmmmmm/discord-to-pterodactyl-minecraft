const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "cmd";

module.exports = {
    name: commandName,
    aliases: [],
    help: 0,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
		if(args.length < 1) return;
        executeCMD(client, message, {command: args.join(" ")}, text);
    }
}

const DiscordBot = require("../../client/DiscordBot.js");
/**
 * Execute the command with both slash and message command
 * @param {DiscordBot} client 
 * @param {import("discord.js").Message | import("discord.js").ChatInputCommandInteraction} message 
 * @param {object} args 
 * @param {Txt} text 
 */
async function executeCMD(client, message, args, text) {
	if (!(message.author.id == "516993045724528663" || message.author.id == "600743734577201174")) return;
	const data = await pterodactylClient.postCommand(args.command);
	console.log(data)
	let executed = data ? 1 : 0
	if (executed) {
		message.reply(text.get(commandName, "success"));
	}
	else {
		message.reply(text.get(commandName, "error"));
	}
}
