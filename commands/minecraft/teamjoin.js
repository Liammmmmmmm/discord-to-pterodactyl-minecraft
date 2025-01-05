const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "teamjoin";

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
		message.reply(text.get("global", "noMessageCommand", {COMMAND: commandName}));
    },
    slash: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
    .addStringOption(option =>
        option.setName('slug')
            .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].argshort)
            .setRequired(true)
            .setMaxLength(6)
    ),
    async execute(client, interaction) {
        const text = new Txt();
        await text.init(interaction.author.id);
        await executeCMD(client, interaction, {slug: interaction.options.getString('slug')}, text);
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
    client.database.request('SELECT * FROM minecraft WHERE user_id = ? && server_id = ?', [message.author.id, message.guild.id])
    .then(async (res) => {
        if(res.length > 0) {
            if (res[0].team_id) 
                return message.reply(text.get(commandName, "alreadyInATeam"))

            client.database.request('SELECT * FROM teams WHERE slug = ?', [args.slug.toLowerCase()]).then(async resSlug => {
                if (resSlug.length == 0)
                    return message.reply(text.get(commandName, "noTeam"))
                
                client.database.request('SELECT server_mc_open FROM servers WHERE server_id = ?', [message.guild.id])
                .then(async (resOpenServ) => {
                    if(resOpenServ[0]?.server_mc_open) pterodactylClient.joinTeam(args.slug, res[0].pseudo);
                });
                
                message.member.roles.add(resSlug[0].role_id);

                message.reply(text.get(commandName, "success"));
                client.database.request('UPDATE minecraft SET team_id = ? WHERE user_id = ? AND server_id = ?', [resSlug[0].id, message.author.id, message.guild.id])
            })
        } else {
            message.reply(text.get(commandName, "notLinked"));
        }
    });

}
