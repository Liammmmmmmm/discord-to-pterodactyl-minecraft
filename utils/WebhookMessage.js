const { success, info, warn, error, debug } = require("./Console");
const DatabaseConnection = require("./SQLRequest");
const { PermissionFlagsBits, WebhookClient } = require('discord.js');
const { settings } = require('../settings');

/**
 * @class WebhookMessage
 * @description The WebhookMessage class handles the creation, initialization, and sending of messages using a Discord webhook.
 *              It interacts with a database to store and retrieve webhook URLs associated with specific channels, ensuring
 *              that webhooks are reused if they already exist, or created anew if they don't. The class provides methods
 *              for initializing a webhook and sending messages through it.
 *
 * @example
 * // Example usage of WebhookMessage class
 * const { WebhookMessage } = require('./WebhookMessage');
 * const webhookMessage = new WebhookMessage();
 *
 * // Initialize the webhook for a specific message's channel
 * webhookMessage.init(message).then(result => {
 *     if (result) {
 *         // Send a message using the initialized webhook
 *         webhookMessage.send('Bot Name', 'https://example.com/avatar.png', 'Hello, world!', []);
 *     } else {
 *         console.log('Failed to initialize webhook.');
 *     }
 * });
 */
class WebhookMessage {
    /**
     * Initializes a webhook for the channel associated with the provided message.
     * If a webhook already exists for the channel, it reuses that webhook. Otherwise, it creates a new webhook
     * and stores its URL in the database for future use.
     *
     * @param {import("discord.js").Message} message - The Discord message object, typically the message that triggered the command.
     * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the webhook was successfully initialized, or `false` otherwise.
     *
     * @example
     * const result = await webhookMessage.init(message);
     * if (result) {
     *     console.log('Webhook initialized successfully.');
     * } else {
     *     console.log('Failed to initialize webhook.');
     * }
     */
    async init(message) {
        if (!message) return false;
        let result = false;
        try {
            let db = new DatabaseConnection();
            await db.request("SELECT * FROM webhook WHERE channel_id = ?", [message.channel.id])
                .then(async res => {
                    if (res.length == 0) {
                        await message.channel.createWebhook({ name: settings.bot.name, avatar: settings.bot.icon })
                            .then(async webhook => {
                                this.webhook = webhook;
                                db.request("INSERT INTO webhook(channel_id, url) VALUE (?, ?)", [message.channel.id, this.webhook.url]);
                                result = true;
                            });
                    } else {
                        this.webhook = new WebhookClient({ url: res[0].url });
                        result = true;
                    }
                })
                .catch(err => {
                    debug.error(err);
                });
        } catch {}
        return result;
    }

    /**
     * Sends a message through the initialized webhook.
     * The method allows you to specify a username, avatar icon, content, and embeds to include in the message.
     * If sending fails, the associated webhook is deleted from the database.
     *
     * @param {string} username - The username to display as the sender of the message.
     * @param {string} icon - The URL of the avatar icon to use for the message.
     * @param {string} content - The text content of the message.
     * @param {import("discord.js").MessageEmbed[]} [embed=[]] - An optional array of embeds to include in the message.
     * @returns {Promise<boolean>} - Returns a promise that resolves to `true` if the message was sent successfully, or rejects with an error if it fails.
     *
     * @example
     * webhookMessage.send('Bot Name', 'https://example.com/avatar.png', 'Hello, world!', [])
     *     .then(() => console.log('Message sent successfully.'))
     *     .catch(err => console.error('Failed to send message:', err));
     */
    async send(username, icon, content, embed) {
        if (!embed) embed = [];
        return new Promise(async (resolve, reject) => {
            await this.webhook.send({
                content: content,
                username: username,
                avatarURL: icon,
                embeds: embed,
            })
            .catch(err => {
                let db = new DatabaseConnection();
                db.request("DELETE FROM webhook WHERE url = ?", [this.webhook.url]);
                reject(err);
            });
            resolve(true);
        });
    }
}

module.exports = { WebhookMessage };
