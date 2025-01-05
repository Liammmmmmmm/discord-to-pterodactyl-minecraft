const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "link";

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
        if(validArgAmount(args, 1, text) != 1) return message.reply(validArgAmount(args, 1, text));

        if(args[0].length > 16) {
            message.reply(text.get(commandName, "tooLong"));
        } else if(args[0].length < 3) {
            message.reply(text.get(commandName, "tooLong"));
        } else {
            executeCMD(client, message, {pseudo: args[0]}, text);
        } 
    },
    slash: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
        .addStringOption(option =>
            option.setName('pseudomc')
                .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].arg1)
                .setRequired(true)
                .setMaxLength(16)
                .setMinLength(3)
        ),
        async execute(client, interaction) {
            const text = new Txt();
            await text.init(interaction.author.id);
            await executeCMD(client, interaction, {pseudo: interaction.options.getString('pseudomc')}, text);
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
    .then((request) => {
        if(request.length > 0) {
            message.reply(text.get(commandName, "alreadyLinked"));
        } else {
            
            client.database.request('SELECT server_mc_open FROM servers WHERE server_id = ?', [message.guild.id])
            .then(async (res) => {
                let executed = res[0]?.server_mc_open || 0
                
                if(executed) {
                    const data = await pterodactylClient.addWhiteList(args.pseudo);
                    if (data.status !== 204) executed = 0

                    message.reply(text.get(commandName, "linkedWhiteList", {PSEUDO: args.pseudo}));
                } else {
                    message.reply(text.get(commandName, "linkedNoWhiteList", {PSEUDO: args.pseudo}));
                }

                client.database.request('INSERT INTO minecraft (user_id, pseudo, server_id, executed) VALUES (?, ?, ?, ?)', [message.author.id, args.pseudo, message.guild.id, executed]);
            })
            
        }
    })
}
