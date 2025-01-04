const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder } = require('discord.js');
const { validArgAmount } = require("../../utils/random");

const commandName = "listlangs";
let formatedLangList = languages.map(el => ({name: el, value: el}));

module.exports = {
    name: commandName,
    aliases: [],
    help: 0,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);

        executeCMD(client, message, {}, text);
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

const DiscordBot = require("../../client/DiscordBot");
/**
 * Execute the command with both slash and message command
 * @param {DiscordBot} client 
 * @param {import("discord.js").Message | import("discord.js").ChatInputCommandInteraction} message 
 * @param {object} args 
 * @param {Txt} text 
 */
async function executeCMD(client, message, args, text) {
    message.reply(text.get(commandName, "reply", {LANG_LIST: languages.join(", ")}));
}