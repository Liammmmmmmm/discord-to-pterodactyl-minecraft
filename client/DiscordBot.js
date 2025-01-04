const { Client, Collection, Partials, GatewayIntentBits } = require("discord.js");
const { warn, error, info, success, debug } = require("../utils/Console");
const { readdirSync } = require('fs');
const CommandsHandler = require("./handlers/CommandsHandler");
const CommandsListener = require("./handlers/CommandsListener")
const InteractionsHandler = require("./handlers/InteractionsHandler");
const InteractionsListener = require("./handlers/InteractionsListener");
const { loadEvents } = require("./handlers/Events")

const DatabaseConnection = require("../utils/SQLRequest")

const { settings } = require("../settings");

class DiscordBot extends Client {
    collection = {
        application_commands: new Collection(),
        message_commands: new Collection(),
        message_commands_aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            context: new Collection(),
            autocomplete: new Collection()
        }
    }
    serverPrefix = [];
    rest_application_commands_array = [];
    database = new DatabaseConnection();
    login_attempts = 0;
    login_timestamp = 0;
    statusMessages = settings.status.statusMessages;
    helpCommandsList = {lang: []};

    commands_handler = new CommandsHandler(this);
    interactions_handler = new InteractionsHandler(this);

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildWebhooks,
            ],
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User
            ],
            presence: {
                activities: [{
                    name: '',
                    type: 4,
                    state: 'Starting...'
                }]
            }
        });

        new CommandsListener(this);
        new InteractionsListener(this);
    }

    startStatusRotation = () => {
        let index = 0;
        setInterval(() => {
            this.user.setPresence({ activities: [this.statusMessages[index]] });
            index = (index + 1) % this.statusMessages.length;
        }, settings.status.switch_delay);
    }

    connect = async () => {
        warn(`Attempting to connect to the Discord bot... (${this.login_attempts + 1})`);

        this.login_timestamp = Date.now();

        try {
            await this.login(process.env.DISCORD_TOKEN);
            warn('Loading help commands');
            this.helpCommandsListAliases = []
            for (const directory of readdirSync('./commands/')) {
                this.helpCommandsList[directory] = [];
                for (const file of readdirSync('./commands/' + directory).filter((f) => f.endsWith('.js'))) {
                    try {
                        const module = require('../commands/' + directory + '/' + file);
    
                        if (!module) continue;
                        if ((!module.name || !module.run) && !module.data && !module.help) continue;
                        if(module.help == 1) this.helpCommandsList[directory].push(module.name);
                        if(module.aliases) {
                            module.aliases.forEach(element => {
                                this.helpCommandsListAliases.push([element, module.name]);
                            })
                        }
                    } catch {}
                }
            }
            this.formatedHelpCmdList = [];
            Object.entries(this.helpCommandsList).forEach(([key, content]) => {
                content.forEach(cmd => this.formatedHelpCmdList.push({name: cmd, value: cmd}))
            })
            success('Successfully cached help commands');
            this.commands_handler.load();
            this.interactions_handler.load();
            this.startStatusRotation();

            warn('Loading events');
            loadEvents(this);

            warn('Caching servers message command prefix');
            await this.database.request("SELECT server_id, prefix FROM servers")
            .then(res => {
                this.serverPrefix = res;
            })
            .catch(err => {
                error("Error while fetching prefixes, shuting down the bot");
                debug.error(err)
                this.destroy();
            })
            success('Successfully cached message command prefix');

            warn('Attempting to register application commands... (this might take a while!)');
            await this.commands_handler.registerApplicationCommands(settings.development);
            success('Successfully registered application commands. For specific guild? ' + (settings.development.enabled ? 'Yes' : 'No'));
        } catch (err) {
            error('Failed to connect to the Discord bot, retrying...');
            console.log(err);
            this.login_attempts++;
            setTimeout(this.connect, 5000);
        }
    }
}

module.exports = DiscordBot;
