const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "closeserver";

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
        executeCMD(client, message, {}, text);
    },
    slash: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(client, interaction) {
            const text = new Txt();
            await text.init(interaction.author.id);
            await executeCMD(client, interaction, {}, text);
        },
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
    client.database.request('SELECT * FROM minecraft WHERE server_id = ? AND executed = 1', [message.guild.id])
    .then((request) => {
		request.forEach(async (element, i) => {
            let executed = 1
			const data = await pterodactylClient.removeWhiteList(element.pseudo);
            
            if (data.status === 204)
                executed = 0;

            debug.info(`✅ User ${element.pseudo} has been removd from whiteList !`)

			client.database.request('UPDATE minecraft SET executed = ? WHERE server_id = ? AND user_id = ?', [executed, message.guild.id, element.user_id]);
		})
        
        message.reply(text.get(commandName, "serverClosed", {PLAYERCOUNT: request.length}));
    })
	client.database.request('UPDATE servers SET server_mc_open = 0 WHERE server_id = ?', [message.guild.id]);
}
