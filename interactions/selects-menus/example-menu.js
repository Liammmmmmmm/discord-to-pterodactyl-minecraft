const DiscordBot = require("../../client/DiscordBot");

module.exports = {
    customId: 'example-menu-id',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'Replied from a Select Menu interaction! (You selected **' + interaction.values[0] + '**).',
            ephemeral: true
        });

    }
}