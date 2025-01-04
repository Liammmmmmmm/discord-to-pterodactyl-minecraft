const { UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");

module.exports = {
    data: {
        name: 'test user context',
        type: 'user',
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'You used user context menu',
            ephemeral: true
        });

    }
}