const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "sendmsg";

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
		if(args.length < 1) return;
        executeCMD(client, message, {msg: args.join(" ")}, text);
    },
    slash: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
    .addStringOption(option =>
        option.setName('msg')
            .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].arg1)
            .setRequired(true)
            .setMaxLength(220)
    ),
    async execute(client, interaction) {
        const text = new Txt();
        await text.init(interaction.author.id);
        await executeCMD(client, interaction, {msg: interaction.options.getString('msg')}, text);
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
            const data = await pterodactylClient.postCommand(`/tellraw @a ["",{"text":"${res[0].pseudo} ","color":"white"},{"text":"via discord","italic":true,"color":"gray"},{"text":" : ${args.msg}"}]`);
            let executed = data ? 1 : 0
            if (executed)
                message.reply(text.get(commandName, "success"));
            else
                message.reply(text.get(commandName, "error"));
        } else {
            message.reply(text.get(commandName, "notLinked"));
        }
    });
}
