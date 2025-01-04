/**
 * @file DefaultEmbeds.js
 * @description This module defines the DefaultEmbed class, which extends the EmbedBuilder class from the Discord.js library.
 *              It provides a method to set default properties on an embed, such as color, footer, author, and thumbnail,
 *              with customizable variables based on the message context.
 */

const { EmbedBuilder } = require('discord.js');
const { replaceVariables } = require("../langs/langs");
const { embeds } = require("../settings");

/**
 * @class DefaultEmbed
 * @extends {EmbedBuilder}
 * @classdesc The DefaultEmbed class extends the functionality of the standard EmbedBuilder from Discord.js.
 *            It simplifies the process of creating embeds with a consistent look and feel by applying default
 *            settings, such as color, footer, author, and thumbnail, based on a predefined configuration and the
 *            context of the message. This allows for more maintainable and scalable embed creation across a Discord bot.
 *
 * @example
 * // Basic usage of DefaultEmbed
 * const { DefaultEmbed } = require('./DefaultEmbeds');
 * const embed = new DefaultEmbed()
 *     .setDefault('primary', message)
 *     .setTitle('This is a custom title')
 *     .setDescription('This is a custom description');
 *
 * message.channel.send({ embeds: [embed] });
 */
class DefaultEmbed extends EmbedBuilder {

    /**
     * Sets default properties for an embed, including color, footer, author, and thumbnail.
     * The method uses predefined settings and replaces variables within these settings based on the context of the provided message.
     *
     * @param {string} embed - The key of the embed configuration from the `embeds` settings object.
     * @param {Object} message - The Discord message object, typically the message that triggered the command.
     * @returns {DefaultEmbed} The modified embed with the default settings applied.
     *
     * @example
     * const embed = new DefaultEmbed().setDefault('primary', message);
     */
    setDefault(embed, message) {
        let variables = {
            SERVER_NAME: "",
            SERVER_IMAGE: "",
            USER_NAME: "",
            USER_IMAGE: "",
        };

        // Attempt to populate variables based on the message context
        try {
            if (message.member) {
                variables.SERVER_NAME = message.member.guild.name;
                variables.SERVER_IMAGE = message.member.guild.iconURL();
            }
            variables.USER_NAME = message.author.globalName;
            variables.USER_IMAGE = message.author.displayAvatarURL();
        } catch {}

        if (!embeds[embed]) return;

        if (embeds[embed].color) this.setColor('#dbaf00');
        if (embeds[embed].footer) {
            this.setFooter({
                text: replaceVariables(embeds[embed].footer.text, variables),
                iconURL: replaceVariables(embeds[embed].footer.imageURL, variables)
            });
            if (embeds[embed].footer.timestamp) this.setTimestamp();
        }
        if (embeds[embed].header) {
            this.setAuthor({
                name: replaceVariables(embeds[embed].header.author, variables),
                iconURL: replaceVariables(embeds[embed].header.authorImageURL, variables),
                url: replaceVariables(embeds[embed].header.authorURL, variables)
            });
            if (embeds[embed].header.thumbnail) {
                this.setThumbnail(replaceVariables(embeds[embed].header.thumbnail, variables));
            }
        }

        return this;
    }
}

module.exports = { DefaultEmbed };
