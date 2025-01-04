const { ModalSubmitInteraction } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");

module.exports = {
    customId: 'example-modal-id',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {

        const field = interaction.fields.getTextInputValue('example-modal-id-field-1');

        await interaction.reply({
            content: 'Hello **' + field + '**.',
            ephemeral: true
        });

    }
}