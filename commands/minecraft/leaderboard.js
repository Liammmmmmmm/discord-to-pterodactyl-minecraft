const { Txt, languages } = require("../../langs/langs.js");
const { settings } = require("../../settings.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { validArgAmount } = require("../../utils/random.js");
const { debug } = require("../../utils/Console.js")
const pterodactylClient = require('../../utils/PteroRequest.js');
const axios = require('axios');
const { DefaultEmbed } = require("../../utils/DefaultEmbeds.js");

const commandName = "leaderboard";
const lBList = [
    { name: 'Temps de jeu', value: 'time_played', caca: 'minecraft:play_time'},
    { name: 'Distance parcourue', value: 'total_distance'},
    { name: 'Nombre de morts', value: 'death_count'},
];

module.exports = {
    name: commandName,
    aliases: [],
    help: 1,
    message: async (client, message, args) => {
        const text = new Txt();
        await text.init(message.author.id);
        if(args[0] != undefined && lBList.find((element) => element.value == args[0]) == undefined) return message.reply(text.get(commandName, "invalidArg"));
		await executeCMD(client, message, {type: args[0]}, text);
    },
    slash: new SlashCommandBuilder()
    .setName(commandName)
    .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
    .addStringOption(option =>
        option.setName('type')
            .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].argtype)
            .setRequired(false)
            .addChoices(lBList)
    )
    .addBooleanOption(option =>
        option.setName('team')
            .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].argteam)
            .setRequired(false)
    ),
    async execute(client, interaction) {
        const text = new Txt();
        await text.init(interaction.author.id);
        await executeCMD(client, interaction, {type: interaction.options.getString('type'), team: interaction.options.getBoolean('team')}, text);
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
    let stats = [];
    let filelist = await pterodactylClient.listFileStats();

    for (element of filelist) {
        let filecontent = await pterodactylClient.readStatsFile(element.name);
        let pseudo = await axios.get(`https://minecraft-api.com/api/pseudo/${element.name.replace(".json", "")}/json`);
        stats.push({pseudo: pseudo.data.pseudo, stats: filecontent.stats});
    };

    if (args.team) {
        const res = await client.database.request('SELECT teams.*, minecraft.pseudo FROM teams LEFT JOIN minecraft ON teams.id = minecraft.team_id', []);
        // replacer les stats actuels par une list de stats par team ou le pseudo est le nom de la team et les stats sont la somme des stats des membres
        let teamStats = [];
        for (element of res) {
            let team = teamStats.find(t => t.pseudo === element.name);
            if (!team) {
                team = {pseudo: element.name, stats: {}};
                teamStats.push(team);
            }
            // addionner les stats de chaque membre (en sachant que les stats sont de la forme {minecraft:custom: {minecraft:stat: 0}})
            for (let member of stats.filter((element2) => element2.pseudo == element.pseudo)) {
                for (let key in member.stats) {
                    if (!team.stats[key]) team.stats[key] = {};
                    for (let subkey in member.stats[key]) {
                        if (!team.stats[key][subkey]) team.stats[key][subkey] = 0;
                        team.stats[key][subkey] += member.stats[key][subkey];
                    }
                }
            }
        }
        stats = teamStats;

    } 

    if (!args.type) args.type = 'time_played';
    let toprint;
    switch (args.type) {
        case "time_played":
            toprint = sortStats(stats, 'minecraft:custom', 'minecraft:play_time').map((element) => {element.stat = (element.stat / 3600 / 20).toFixed(2) +  "h"; return element;});
            break;
        case "total_distance":
            toprint = sortStatsByTotalDistance(stats);
            break;
        case "death_count":
            toprint = sortStats(stats, 'minecraft:custom', 'minecraft:deaths');
            break;
        default:
            break;
    }
    let messageToSend = toprint.map((element, index) => {
        return `${index + 1}. **${element.pseudo}** : ${element.stat}`;
    }).join("\n");

    if (!messageToSend) {
        messageToSend = "No data available.";
    }
    const embed = new DefaultEmbed()
    .setDefault('primary', message)
    .setTitle('Leaderboard')
    .setDescription(`__Voici le leaderboard de la categorie ${lBList.find((element) => element.value == args.type).name}__\n\n${messageToSend}`);

    message.channel.send({ embeds: [embed] });

}

function sortStats(statslist, category, stat) {
    statslist = statslist.sort((b, a) => {
        return (a.stats?.[category]?.[stat] || 0) - (b.stats?.[category]?.[stat] || 0);
    });
    return statslist.slice(0, 10).map((element) => {
        return {pseudo: element.pseudo, stat: (element.stats?.[category]?.[stat] || 0)};
    });
}

function getTotalDistance(stats) {
    let totalDistance = 0;
    for (let key in stats['minecraft:custom']) {
        if (key.endsWith('one_cm')) {
            totalDistance += stats['minecraft:custom'][key];
        }
    }
    return totalDistance;
}

function sortStatsByTotalDistance(statslist) {
    statslist = statslist.sort((b, a) => {
        return getTotalDistance(a.stats) - getTotalDistance(b.stats);
    });
    return statslist.slice(0, 10).map((element) => {
        return {pseudo: element.pseudo, stat: (getTotalDistance(element.stats) / 100000).toFixed(2) + "km"};
    });
}