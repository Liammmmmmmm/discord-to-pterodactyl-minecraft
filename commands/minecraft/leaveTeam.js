const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "leaveteam";

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    slash: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
        .addUserOption(option =>
            option.setName('user')
                .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].arg1)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(client, interaction) {
            const text = new Txt();
            await text.init(interaction.author.id);

            const user = interaction.options.getUser('user')

            const member = await interaction.guild.members.fetch(user.id);

            await executeCMD(client, interaction, {user: member}, text);
        },
}

const DiscordBot = require("../../client/DiscordBot");
/**
 * Execute the command with both slash and message command
 * @param {DiscordBot} client 
 * @param {import("discord.js").Message | import("discord.js").ChatInputCommandInteraction} message 
 * @param {object} args 
 * @param {Txt} text 
 */
async function executeCMD(client, message, args, text) {
    console.log(args.user)

    client.database.request('SELECT * FROM minecraft WHERE user_id = ? && server_id = ?', [args.user.id, message.guild.id])
        .then(async (res) => {
            if(res.length > 0) {
                client.database.request('SELECT * FROM teams WHERE id = ?', [res[0].team_id]).then(async resSlug => {
                    if (resSlug.length == 0)
                        return message.reply(text.get(commandName, "noTeam"))

                    args.user.roles.remove(resSlug[0].role_id);

                    // remove Mc
                    if (res[0].executed)
                        pterodactylClient.leaveTeam(resSlug[0].slug, res[0].pseudo)

                    message.reply(text.get(commandName, "success"));
                    client.database.request('UPDATE minecraft SET team_id = NULL WHERE user_id = ? AND server_id = ?', [args.user.id, message.guild.id])
                })
            } else 
                return message.reply(text.get(commandName, "noTeam"))
        })

    
    
    
    // message.reply("caca")
}