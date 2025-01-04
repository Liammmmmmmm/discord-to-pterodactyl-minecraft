const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { DefaultEmbed } = require("../../utils/DefaultEmbeds.js");
const { WebhookMessage } = require("../../utils/WebhookMessage.js");
const { debug } = require("../../utils/Console.js")

const commandName = "sendwebhook";

module.exports = {
    name: commandName,
    aliases: [],
    help: 0,
    slash: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageWebhooks),
        async execute(client, interaction) {
            await executeCMD(client, interaction, {});
        },
}

/**
 * Execute the command with both slash and message command
 * @param {import("../../client/DiscordBot.js").DiscordBot} client 
 * @param {import("discord.js").ChatInputCommandInteraction} message 
 * @param {object} args 
 * @param {Txt} text 
 */
async function executeCMD(client, message, args) {
    const text = new Txt();
    await text.init(message.author.id);

    let embed = new DefaultEmbed().setDefault("primary", message).setTitle("Ceci est un exemple").setDescription("d'un messsage envoyé via un webhook")

    let webhook = new WebhookMessage();
    let success = await webhook.init(message);

    if(success) {
        await webhook.send("Testttttt", "https://cdn.discordapp.com/avatars/516993045724528663/a_a23b52cd2bfe6ccd22e868da801a9969.webp?size=160", "ceci est un test", [embed])
        .then(() => {
            message.reply({content: text.get(commandName, "success"), ephemeral: true})
        })
        .catch(err => {
            message.reply({content: text.get(commandName, "error"), ephemeral: true})
            debug.error(err);
        })
    } else {
        message.reply({content: text.get(commandName, "noPermission"), ephemeral: true})
    }
}