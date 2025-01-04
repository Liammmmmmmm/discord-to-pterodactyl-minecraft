const { REST, Routes } = require('discord.js');
const { info, error, success, debug } = require('../../utils/Console');
const { readdirSync } = require('fs');
const DiscordBot = require('../DiscordBot');

/**
 * @class CommandsHandler
 * @description Handles loading, reloading, and registering of Discord bot commands. 
 *              The class manages both message-based commands and application commands, 
 *              ensuring they are properly loaded from the filesystem, stored in the bot's collections, 
 *              and registered with the Discord API.
 *
 * @example
 * // Initialize the CommandsHandler with a DiscordBot instance
 * const handler = new CommandsHandler(botClient);
 * 
 * // Load all commands
 * handler.load();
 * 
 * // Register application commands
 * handler.registerApplicationCommands({ enabled: true, guildIds: ['guild_id_1', 'guild_id_2'] });
 */
class CommandsHandler {
    client;

    /**
     *
     * @param {DiscordBot} client 
     */
    constructor(client) {
        this.client = client;
    }

    load = () => {
        for (const directory of readdirSync('./commands/')) {
            for (const file of readdirSync('./commands/' + directory).filter((f) => f.endsWith('.js'))) {
                try {
                    const module = require('../../commands/' + directory + '/' + file);

                    if (!module) continue;

                        if ((!module.name || !module.message) && !module.slash) {
                            error('Unable to load the command ' + file);
                            continue;
                        }

                        if (module.name && module.message) {
                            this.client.collection.message_commands.set(module.name, module);

                            if (module.aliases && Array.isArray(module.aliases)) {
                                module.aliases.forEach((alias) => {
                                    this.client.collection.message_commands_aliases.set(alias, module.name);
                                });
                            }

                            info('Loaded new message command: ' + file);
                        }
                        if (module.slash) {
                            this.client.collection.application_commands.set(module.name, module);
                            this.client.rest_application_commands_array.push(module.slash.toJSON());

                            info('Loaded new application command: ' + file);
                        }
                } catch (e) {
                    error('Unable to load a command from the path: ' + '/commands/' + directory + '/' + file);
                    debug.error(e)
                }
            }
        }

        success(`Successfully loaded ${this.client.collection.application_commands.size} application commands and ${this.client.collection.message_commands.size} message commands.`);
    }

    reload = () => {
        this.client.collection.message_commands.clear();
        this.client.collection.message_commands_aliases.clear();
        this.client.collection.application_commands.clear();
        this.client.rest_application_commands_array = [];

        this.load();
    }
    
    /**
     * @param {{ enabled: boolean, guildIds: string }} development
     * @param {Partial<import('discord.js').RESTOptions>} restOptions 
     */
    registerApplicationCommands = async (development, restOptions = null) => {
        const rest = new REST(restOptions ? restOptions : { version: '10' }).setToken(this.client.token);

        if (development.enabled) {
            development.guildIds.forEach(async element => {
                await rest.put(Routes.applicationGuildCommands(this.client.user.id, element), { body: this.client.rest_application_commands_array });
            })
        } else {
            // await development.guildIds.forEach(async element => {
            //     const guild = this.client.guilds.cache.get(element);
            //     this.client.application.commands.set([]);
            //     guild.commands.set([]);
            // })
            await rest.put(Routes.applicationCommands(this.client.user.id), { body: this.client.rest_application_commands_array });
        }
    }
}

module.exports = CommandsHandler;