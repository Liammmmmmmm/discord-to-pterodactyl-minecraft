const onBotMention = require("./onBotMention");
const randomMessages = require("./randomMessages");
/**
 * 
 * @param {import("discord.js").Client} client 
 * @param {import("discord.js").Message} message 
 */
function messageReactions(client, message) {
    if(message.content == `<@${client.user.id}>`) {
        onBotMention(client, message);
    } else {
        randomMessages(client, message);
    }
}

module.exports = messageReactions;