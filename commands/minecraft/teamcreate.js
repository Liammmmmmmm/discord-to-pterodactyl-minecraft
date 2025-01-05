const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "teamcreate";
const formattedColorList = [
    { name: 'Noir', value: 'black', hex: '000000' },
    { name: 'Bleu Foncé', value: 'dark_blue', hex: '0000AA' },
    { name: 'Vert Foncé', value: 'dark_green', hex: '00AA00' },
    { name: 'Turquoise', value: 'dark_aqua', hex: '00AAAA' },
    { name: 'Rouge Foncé', value: 'dark_red', hex: 'AA0000' },
    { name: 'Violet', value: 'dark_purple', hex: 'AA00AA' },
    { name: 'Orange', value: 'gold', hex: 'FFAA00' },
    { name: 'Gris', value: 'gray', hex: 'AAAAAA' },
    { name: 'Gris Foncé', value: 'dark_gray', hex: '555555' },
    { name: 'Bleu', value: 'blue', hex: '5555FF' },
    { name: 'Vert', value: 'green', hex: '55FF55' },
    { name: 'Bleu ciel', value: 'aqua', hex: '55FFFF' },
    { name: 'Rouge', value: 'red', hex: 'FF5555' },
    { name: 'Rose', value: 'light_purple', hex: 'FF55FF' },
    { name: 'Jaune', value: 'yellow', hex: 'FFFF55' },
    { name: 'Blanc', value: 'white', hex: 'FFFFFF' }
];

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
        option.setName('name')
            .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].argfullname)
            .setRequired(true)
            .setMaxLength(20)
    )
    .addStringOption(option =>
        option.setName('slug')
            .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].argshort)
            .setRequired(true)
            .setMaxLength(6)
    )
    .addStringOption(option =>
        option.setName('color')
            .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].argcolor)
            .setRequired(true)
            .addChoices(formattedColorList)
    ),
    async execute(client, interaction) {
        const text = new Txt();
        await text.init(interaction.author.id);
        await executeCMD(client, interaction, {name: interaction.options.getString('name'), slug: interaction.options.getString('slug'), color: interaction.options.getString('color')}, text);
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
    // message.reply(text.get(commandName, "success"));
    
    client.database.request('SELECT * FROM minecraft WHERE user_id = ? && server_id = ?', [message.author.id, message.guild.id])
    .then(async (res) => {
        if(res.length > 0) {
            client.database.request('SELECT * FROM teams WHERE slug = ?', [args.slug]).then(async resSlug => {
                if (resSlug.length)
                    return message.reply(text.get(commandName, "alreadyTakenName"))
            
                client.database.request('SELECT server_mc_open FROM servers WHERE server_id = ?', [message.guild.id])
                .then(async (resOpenServ) => {
                    let servopen = resOpenServ[0]?.server_mc_open || 0
                    
                    if(servopen) pterodactylClient.createTeam(args.name, args.slug, args.color, res[0].pseudo);
                        
                    message.reply(text.get(commandName, "success"));

                    const resRoleID = await message.guild.roles.create({ name: args., reason: 'Creating new role', color: formattedColorList.find((color) => color.value === 'gold').hex })
                    message.member.roles.add(resRoleID);

                    client.database.request('INSERT INTO teams (server_id, user_id, name, slug, color, executed, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)', [message.guild.id, message.author.id, args.name, args.slug, args.color, servopen, resRoleID.id]).then(resInsetTeam => {
                        client.database.request('UPDATE minecraft SET team_id = ? WHERE user_id = ? AND server_id = ?', [resInsetTeam.insertId, message.author.id, message.guild.id])
                    });
                })
            })
        } else {
            message.reply(text.get(commandName, "notLinked"));
        }
    });

}
