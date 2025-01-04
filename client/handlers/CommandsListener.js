const { PermissionsBitField, ChannelType, Events } = require("discord.js");
const DiscordBot = require("../DiscordBot");
const { settings } = require("../../settings");
const { error, debug } = require("../../utils/Console");
const randomMessages = require("../../messagesReactions/messagesReaction")

/**
 * @class CommandsListener
 * @description Listens for and handles command interactions from Discord messages and application commands.
 *              It processes messages to determine if they contain bot commands, executes them if they do,
 *              and handles application commands (slash commands) by executing the corresponding command functions.
 *              The class also manages command prefixes for different servers, storing default prefixes in the database if not already set.
 *
 * @example
 * // Initialize the CommandsListener with a DiscordBot instance
 * const listener = new CommandsListener(botClient);
 * // This will automatically set up event listeners for message creation and interaction events.
 */
class CommandsListener {
    /**
     * @param {DiscordBot} client - An instance of the DiscordBot class to listen for events and execute commands.
     */
    constructor(client) {
        client.on(Events.MessageCreate, async message => {
            if (message.author.bot || message.channel.type === ChannelType.DM) return;

            randomMessages(client, message);

            let prefix = client.serverPrefix.find(element => element.server_id == message.guild.id);

            if (!prefix) {
                client.database.request("INSERT INTO servers(server_id, prefix) VALUES (?, ?)", [message.guild.id, settings.commands.prefix])
                    .then(res => {
                        client.serverPrefix.push({ server_id: message.guild.id, prefix: settings.commands.prefix });
                    })
                    .catch(err => {
                        debug.error(err);
                    });
                prefix = settings.commands.prefix;
            } else {
                prefix = prefix.prefix;
            }

            if (!message.content.startsWith(prefix)) return;

            const commandInput = message.content.split(" ")[0].replace(prefix, "");

            if (commandInput.length == 0) return;

            const command = client.collection.message_commands.get(commandInput) ||
                client.collection.message_commands.get(client.collection.message_commands_aliases.get(commandInput));

            if (!command) return;

            let args = message.content.slice(prefix.length + commandInput.length).split(/ +/);
            args.shift();

            try {
                command.message(client, message, args);
            } catch (err) {
                error(err);
            }
        });

        client.on(Events.InteractionCreate, async (interaction) => {
            if (!interaction.isCommand()) return;

            const command = client.collection.application_commands.get(interaction.commandName);

            if (!command) return;

            try {
                interaction = transformParam(interaction);
                command.execute(client, interaction);
            } catch (err) {
                error(err);
            }
        });
    }
}

/**
 * Transforms interaction parameters to match message parameter structure.
 *
 * @param {Object} params - The interaction parameters to be transformed.
 * @returns {Object} - The transformed parameters with 'user' replaced by 'author' if present.
 */
function transformParam(params) {
    if (params.hasOwnProperty('user')) {
        params.author = params.user;
        delete params.user;
    }
    return params;
}

module.exports = CommandsListener;
