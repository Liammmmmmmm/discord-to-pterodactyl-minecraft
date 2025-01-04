const { success, error } = require("../../utils/Console");
const { readdirSync } = require('fs');

/**
 * Loads and registers event handlers for the Discord client from the `./events` directory.
 * It iterates through all JavaScript files in the directory, requiring and setting up event listeners
 * based on their exported properties. Events can be registered as either one-time (`once`) or recurring listeners.
 *
 * @param {import('../DiscordBot')} client - The Discord client instance to which events will be attached.
 * 
 * @example
 * // Assuming you have a Discord client instance
 * const { loadEvents } = require('./path/to/loadEvents');
 * loadEvents(client);
 */
function loadEvents(client) {
    const eventFiles = readdirSync("./events").filter((file) => file.endsWith(".js"));

    for (const file of eventFiles) {
        const event = require(`../../events/${file}`);
        if (event.name && event.execute) {
            try {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(
                        event.name,
                        async (...args) => await event.execute(...args, client)
                    );
                }
                success("Loaded " + event.name + " event");
            } catch (err) {
                console.log(err);
                error("Error loading event " + event.name);
            }
        } else {
            error("Error loading event " + event.name);
        }
    }
}

module.exports = { loadEvents };
