const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');
require('dotenv').config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const PTERO_API_KEY = process.env.PTERO_API_KEY;
const PTERO_SERVER_URL = process.env.PTERO_SERVER_URL;
const SERVER_ID = process.env.PTERO_SERVER_ID;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

async function envoyerCommande(commande) {
    try {
        const response = await axios.post(
            `${PTERO_SERVER_URL}/api/client/servers/${SERVER_ID}/command`,
            { command: commande },
            {
                headers: {
                    Authorization: `Bearer ${PTERO_API_KEY}`,
                    'Content-Type': 'application/json',
                    Accept: 'Application/vnd.pterodactyl.v1+json'
                }
            }
        );

        if (response.status === 204) {
            return 'Commande envoyée avec succès.';
        } else {
            return `Erreur inattendue : ${response.status}`;
        }
    } catch (error) {
        console.error(error.response?.data || error.message);
        return `Erreur : ${error.response?.data?.errors[0]?.detail || error.message}`;
    }
}

client.once('ready', () => {
    console.log(`Connecté en tant que ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    if (!message.content.startsWith('!mc') || message.author.bot) return;

    const commande = message.content.slice(4).trim();

    if (!commande) {
        message.reply('Veuillez fournir une commande à envoyer.');
        return;
    }

    const result = await envoyerCommande(commande);
    message.reply(result);
});

client.login(DISCORD_TOKEN);
