const { info, error, success } = require('../../utils/Console');
const { readdirSync } = require('fs');
const DiscordBot = require('../DiscordBot');
const { REST, Routes } = require('discord.js');

/**
 * @class InteractionsHandler
 * @description Manages the loading and reloading of interaction components for a Discord bot. 
 *              This includes autocomplete components, buttons, context menus, modals, and select menus. 
 *              It registers these components with the bot and maintains them in collections for handling interactions.
 *
 * @example
 * // Initialize the InteractionsHandler with a DiscordBot instance
 * const handler = new InteractionsHandler(botClient);
 * 
 * // Load all interaction components
 * handler.load();
 * 
 * // Reload all interaction components (e.g., after updating)
 * handler.reload();
 */
class InteractionsHandler {

    /**
     * @param {DiscordBot} client - An instance of the DiscordBot class to manage interaction components.
     */
    constructor(client) {
        this.client = client;
    }

    /**
     * Loads interaction components from the `./interactions` directory.
     * This includes:
     * - Autocomplete components from `./interactions/autocomplete`
     * - Buttons from `./interactions/buttons`
     * - Context menus from `./interactions/context-menus`
     * - Modals from `./interactions/modals`
     * - Select menus from `./interactions/selects-menus`
     * Each type is registered in the appropriate collection and logged.
     * 
     * @returns {void}
     */
    load = () => {
        for (const file of readdirSync('./interactions/autocomplete').filter((f) => f.endsWith('.js'))) {
            const module = require(`../../interactions/autocomplete/${file}`);
            if (!module.commandName || !module.run) {
                error('Unable to load the autocomplete component ' + file);
                continue;
            }
            this.client.collection.components.autocomplete.set(module.commandName, module);
            info(`Loaded new component (type: autocomplete) : ` + file);
        }

        for (const file of readdirSync('./interactions/buttons').filter((f) => f.endsWith('.js'))) {
            const module = require(`../../interactions/buttons/${file}`);
            if (!module.customId || !module.run) {
                error('Unable to load the buttons ' + file);
                continue;
            }
            this.client.collection.components.buttons.set(module.customId, module);
            info(`Loaded new button : ` + file);
        }

        for (const file of readdirSync('./interactions/context-menus').filter((f) => f.endsWith('.js'))) {
            const module = require(`../../interactions/context-menus/${file}`);
            if (!module.data.name || !module.run || !module.data.type) {
                error('Unable to load the context menu ' + file);
                continue;
            }
            if (module.data.type == "user") this.client.collection.components.context.set("user-" + module.data.name, module);
            if (module.data.type == "message") this.client.collection.components.context.set("mess-" + module.data.name, module);

            module.data.type = module.data.type.replace("message", 3).replace("user", 2);
            this.client.rest_application_commands_array.push(module.data);
            info(`Loaded new context menu : ` + file);
        }

        for (const file of readdirSync('./interactions/modals').filter((f) => f.endsWith('.js'))) {
            const module = require(`../../interactions/modals/${file}`);
            if (!module.customId || !module.run) {
                error('Unable to load the modal ' + file);
                continue;
            }
            this.client.collection.components.modals.set(module.customId, module);
            info(`Loaded new modal : ` + file);
        }

        for (const file of readdirSync('./interactions/selects-menus').filter((f) => f.endsWith('.js'))) {
            const module = require(`../../interactions/selects-menus/${file}`);
            if (!module.customId || !module.run) {
                error('Unable to load the select menu ' + file);
                continue;
            }
            this.client.collection.components.selects.set(module.customId, module);
            info(`Loaded new select menu : ` + file);
        }

        const componentsCollection = this.client.collection.components;

        success(`Successfully loaded ${componentsCollection.autocomplete.size + componentsCollection.buttons.size + componentsCollection.selects.size + componentsCollection.modals.size + componentsCollection.context.size} components.`);
    }

    /**
     * Clears all currently loaded interaction components and reloads them.
     * This is useful for refreshing components after updates or changes.
     * 
     * @returns {void}
     */
    reload = () => {
        this.client.collection.components.autocomplete.clear();
        this.client.collection.components.buttons.clear();
        this.client.collection.components.modals.clear();
        this.client.collection.components.context.clear();
        this.client.collection.components.selects.clear();

        this.load();
    }
}

module.exports = InteractionsHandler;
