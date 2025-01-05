const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "openserver";

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
    client.database.request('SELECT * FROM teams WHERE executed = 0 AND server_id', [message.guild.id])
    .then((request) => {
		request.forEach(async (element) => {
            let executed = 0
			let data = await pterodactylClient.createTeamOnly(element.name, element.slug, element.color);
            
            if (data)
            {
                debug.info(`✅ Team ${element.slug} has been created !`);
                executed = 1
            }

			client.database.request('UPDATE teams SET executed = ? WHERE server_id = ? AND id = ?', [executed, message.guild.id, element.id]);
		})
    })
    client.database.request('SELECT minecraft.*, teams.slug FROM minecraft LEFT JOIN teams ON minecraft.team_id = teams.id WHERE minecraft.server_id = ? AND minecraft.executed = 0', [message.guild.id])
    .then((request) => {
		request.forEach(async (element) => {
            let executed = 0
			let data = await pterodactylClient.addWhiteList(element.pseudo);

            let data2 = 1;
            if (element.team_id)
                data2 = await pterodactylClient.joinTeam(element.slug, element.pseudo);
            
            if (data && data2)
                executed = 1

            debug.info(`✅ User ${element.pseudo} has been add to WhiteList !`)

			client.database.request('UPDATE minecraft SET executed = ? WHERE server_id = ? AND user_id = ?', [executed, message.guild.id, element.user_id]);
		})

        message.reply(text.get(commandName, "serverOpened", {PLAYERCOUNT: request.length}));
    })
	client.database.request('UPDATE servers SET server_mc_open = 1 WHERE server_id = ?', [message.guild.id]);
}
