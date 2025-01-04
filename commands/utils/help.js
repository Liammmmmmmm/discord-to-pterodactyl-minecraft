const { Txt, languages } = require("../../langs/langs.js");
const { DefaultEmbed } = require("../../utils/DefaultEmbeds.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmountInterval } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const originalClient = require("../../main.js");

const commandName = "help";

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
        if(validArgAmountInterval(args, 0, 1, text) != 1) return message.reply(validArgAmountInterval(args, 0, 1, text));

        if(args.length == 1) {
            if(originalClient.formatedHelpCmdList.find(element => element.name == args[0])) {
                executeCMD(client, message, {cmd: args[0]}, text);
            } else if(originalClient.helpCommandsListAliases.find(element => element[0] == args[0])) {
                executeCMD(client, message, {cmd: originalClient.helpCommandsListAliases.find(element => element[0] == args[0])[1]}, text);
            } else {
                message.reply(text.get(commandName, "invalidCommand"));
            }
        } else {
            executeCMD(client, message, {cmd: null}, text);
        } 
    },
    slash: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
        .addStringOption(option =>
            option.setName('command')
                .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
                .setRequired(false)
                .addChoices(originalClient.formatedHelpCmdList)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(client, interaction) {
            const text = new Txt();
            await text.init(interaction.author.id);
            if(interaction.options.getString('command')) {
                await executeCMD(client, interaction, {cmd: interaction.options.getString('command')}, text);
            } else {
                await executeCMD(client, interaction, {cmd: null}, text);
            } 
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
    if(args.cmd == null) {
        let embeds = [];
        let embed = new DefaultEmbed().setDefault("primary", message);
        let fieldAmount = 0;
        embed.setTitle(text.get(commandName, "title"));
        Object.entries(originalClient.helpCommandsList).forEach(([key, content]) => {
            if(content) {
                let texts = [];
                let taille = 0;
                let tour = 0;
                let cat_desc = text.get("categories", key);
                if(cat_desc == "Text error") cat_desc = "";
                cat_desc = text.get(commandName, "categoryformat", {CATEGORY_NAME: key, CATEGORY_DESCRIPTION: cat_desc});
                content.forEach(el => {
                    if(taille == 0) texts[tour] = "";
                    texts[tour] += text.get(commandName, "commandformat", {PREFIX: client.serverPrefix.find(element => element.server_id == message.guild.id)?.prefix | settings.commands.prefix, COMMAND_NAME: el, COMMAND_DESCRIPTION: text.get(el, "description")}) + "\n";
                    taille = texts[tour].length;
                    if(taille + 100 > 1024) {
                        taille = 0;
                        embed.addFields({ name: cat_desc, value: texts, inline: false})
                        fieldAmount++;
                        if(fieldAmount >= 25) {
                            embeds.push(embed);
                            embed = new DefaultEmbed().setDefault("primary", message); 
                        }
                        cat_desc = "--";
                        tour++;
                    }
                })
                if(texts != "") {
                    embed.addFields({ name: cat_desc, value: texts[tour], inline: false});
                    fieldAmount++;
                    if(fieldAmount >= 25) {
                        embeds.push(embed);
                        embed = new DefaultEmbed().setDefault("primary", message); 
                    }
                }
            }
        })
        embeds.push(embed);
        message.reply({embeds: embeds})
    } else {
        let embed = new DefaultEmbed().setDefault("primary", message);
        embed.setTitle(args.cmd);
        let alias = "";
        if(originalClient.helpCommandsListAliases.filter(element => element[1] == args.cmd).length != 0) {
            alias =  "\n\n" + text.get(commandName, "aliases", {ALIASES_LIST: originalClient.helpCommandsListAliases.filter(element => element[1] == args.cmd).map(element => element[0]).join(", ")})
        }
        embed.setDescription(text.get(args.cmd, "advancedDesc") + alias)
        message.reply({embeds: [embed]})
    }
}

