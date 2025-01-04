const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder } = require('discord.js');
const { validArgAmount } = require("../../utils/random");

const commandName = "changelang";
let formatedLangList = languages.map(el => ({name: el, value: el}));

module.exports = {
    name: commandName,
    aliases: ["setlang"],
    help: 0,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
        if(validArgAmount(args, 1, text) != 1) return message.reply(validArgAmount(args, 1, text));

        if(languages.includes(args[0])) {
            executeCMD(client, message, {lang: args[0]}, text);
        } else {
            message.reply(text.get(commandName, "badLanguageProvided", {LANG_LIST: languages.join(", ")}));
        } 
    },
    slash: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
        .addStringOption(option =>
            option.setName('lang')
                .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
                .setRequired(true)
                .addChoices(formatedLangList)
        ),
        async execute(client, interaction) {
            const text = new Txt();
            await text.init(interaction.author.id);
            await executeCMD(client, interaction, {lang: interaction.options.getString('lang')}, text);
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
    text.changeLanguage(args.lang)
    .then(res => {
        message.reply(text.get(commandName, "reply", {LANG: args.lang}));
    })
    .catch(err => {
        debug.error(err);
        message.reply(text.get("global", "error"));
    })
}