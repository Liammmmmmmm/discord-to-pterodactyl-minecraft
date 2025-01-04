const { UserContextMenuCommandInteraction, MessageContextMenuCommandInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");

module.exports = {
    data: {
        name: 'test message context',
        type: 'message',
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {MessageContextMenuCommandInteraction | UserContextMenuCommandInteraction} interaction 
     */
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'You used message context menu',
            ephemeral: true
        });

    }
}