const { ButtonInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");

module.exports = {
    customId: 'example-button-id',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ButtonInteraction} interaction 
     */
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'Replied from a Button interaction!',
            ephemeral: true
        });

    }
}