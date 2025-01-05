const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "teamlist";

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
		await executeCMD(client, message, {}, text);
    },
    slash: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description),
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
    client.database.request('SELECT teams.*, minecraft.pseudo FROM teams LEFT JOIN minecraft ON teams.id = minecraft.team_id', []).then(async res => {
        console.log(res)
        let teams = {};

        res.forEach(element => {
            if (!teams[element.id]) {
                teams[element.id] = {
                    ...element,
                    pseudo: element.pseudo ? [element.pseudo] : []
                };
            } else if (element.pseudo) {
                teams[element.id].pseudo.push(element.pseudo);
            }
        });

        let msg = "Liste des equipes existantes avec leurs noms, identifiants et joueurs :\n\n";
        Object.values(teams).forEach(team => {
            msg += `__**${team.name}**__ - \`${team.slug}\`\n`;
            if (team.pseudo.length > 0) {
                msg += `> ${team.pseudo.join(', ')}\n`;
            }
            msg += "\n";
        });

        message.reply(msg);
    })
}
