const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');

const commandName = "commandtest";
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
        executeCMD(client, message, {}, text);
    }
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
    // message.guild.id

    
    const res = await message.guild.roles.create({ name: 'New role', reason: 'Creating new role', color: formattedColorList.find((color) => color.value === 'gold').hex })

    message.member.roles.add(res.id);

    console.log(res)
    
    message.reply("caca")		
}
