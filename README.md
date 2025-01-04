[![discord.js](https://img.shields.io/github/package-json/dependency-version/Liammmmmmmm/discord-js-template-v14/discord.js)](https://discord.js.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://opensource.org/licenses/MIT)
[![Pull Requests](https://img.shields.io/badge/Pull%20Requests-Welcome!-brightgreen)](https://github.com/Liammmmmmmm/discord-js-template-v14/pulls)

# Discord Bot Template

This is a template for a Discord bot using discord.js v14.15.3 and MySQL. Feel free to use and customize it for your own needs!

## Features

- 💬 Slash & message commands: Supports both slash commands and traditional message commands.
- 🔄 Simple event management: Easy setup and handling of Discord events.
- 🛠️ Interactive components: Manage buttons, select menus, context menus, modals, and autocomplete effortlessly.
- 🗨️ Message reactions & mentions: React to messages and handle bot mentions seamlessly.
- 🌐 Multilingual support: Users can select their preferred language for bot responses.
- 📜 Auto generated help
- 🗄️ MySQL integration: Connects with MySQL databases for data storage and management.
- 🎨 Easy embed creation: Create and customize rich embed messages with ease.
- 🌐 Webhook management: Register, handle, and send webhooks with simplicity.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A Discord account and a server to add the bot to
- A MySQL server

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/Liammmmmmmm/discord-js-template-v14.git
    cd discord-js-template-v14
    ```

2. Install the required dependencies:

    ```sh
    npm install
    ```

### Configuration

1. Copy the `.env.example` file to `.env`:

    ```sh
    cp .env.example .env
    ```

2. Open the `.env` file with your preferred text editor and fill in the required fields:

    ```env
    DISCORD_TOKEN = YOUR_DISCORD_BOT_TOKEN
    
    DB_HOST = YOUR_DATABASE_HOST
    DB_USER = YOUR_DATABASE_USER
    DB_PASSWORD = YOUR_DATABASE_PASSWORD
    DB_NAME = YOUR_DATABASE_NAME
    ```

### Usage

To start the bot, run the following command:

```sh
node index.js
```

## Exemples & Documentation

### 🛠️ Defaults commands and structure
```
commands/
├─ new_folder/
│  ├─ changeLang.js
│  └─ listlangs.js
├─ utils/
│  ├─ help.js
│  ├─ ping.js
│  ├─ sendwebhook.js
│  └─ setPrefix.js
└─ othercommandfolder/
   ├─ yourcommand.js
   └─ yoursecondcommand.js
```

The folders are category for your commands (detailed in the auto generated help section) and each one contain files with you commands 

#### 📜 Auto generated help
By default, the help command is auto generated. Folders are category described in the lang file, and take the description of each command. You can change the display of the commands in each lang file, default is :

__CATEGORY_NAME__: CATEGORY_DESCRIPTION
- **COMMAND_NAME**: COMMAND_DESCRIPTION

When the help command is used with an arg (witch is a command or alias name), it show the advanced description of the command (writen in each language file). Aliases list is also given.

You can choose to not display a command in the help with help parameter to 0 in the command file.

#### 🌐 List langs
Just list all of the possibles languages of the bot.

#### 🌐 Change lang
Change the bot language to one of the possible languages of the bot

#### 🛠️ Ping
Just ping the bot.

#### 🛠️ Change prefix
Change the bot prefix for the server. Availaible for every user with the Administrator permission

#### 🎨 Send Webhook
Webhook sending example. Detailed in the [webhook managment section section](#-webhook-management-register-handle-and-send-webhooks-with-simplicity)



### 💬 Slash & message commands

This bot template supports both slash commands and traditional message commands, allowing you to define and manage commands in a unified manner. You can set up commands that respond to both message-based interactions and slash commands with the same functionality.

#### Example Command

Here's an example of how to set up a command that works with both slash commands and message commands:

```js
const commandName = "commandname"; // Your command name here

module.exports = {
    name: commandName,
    aliases: ["commandnamealias"], // just a list of aliases
    help: 1, // display or not in the auto generated help
    message: async (client, message, args) => {
        // manage here the arguments in the message command
        const text = new Txt(); // Txt object, more explainaitions in language section
        await text.init(message.author.id);
        // check the arg amount and send error message if needed
        if(validArgAmount(args, 1, text) != 1) return message.reply(validArgAmount(args, 1, text));

        // when everythings good, execute your command with the args
        executeCMD(client, message, {yourargname: args[0]},text);
    },
    slash: new SlashCommandBuilder()
        .setName(commandName)
        .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].description)
        .addStringOption(option =>
            option.setName('yourargname')
                .setDescription(require("../../langs/texts/" + settings.messages.defaultLang).texts[commandName].arg1)
                .setRequired(true)
                .setMaxLength(25)    
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        async execute(client, interaction) {
            // manage here the arguments in the slash command

            const text = new Txt();
            await text.init(interaction.author.id);
            await executeCMD(client, interaction, {yourargname: interaction.options.getString('yourargname')}, text);
        },
}

async function executeCMD(client, message, args, text) {
    // Command execution...
    message.reply("example: " + args.yourargname);
}
```

#### Breakdown

- **`name`**: The command's unique name.
- **`aliases`**: Alternative names for the command.
- **`help`**: Determines if the command appears in auto-generated help (1 = yes, 0 = no).
- **`message`**: Handles command execution from messages.
- **`slash`**: Configures the slash command using `SlashCommandBuilder`.
- **`executeCMD`**: Function where the actual command logic is processed. 

### 🔄 Simple event management: Easy setup and handling of Discord events.

Easily set up and handle Discord events with a straightforward approach.

#### Example Event Handler

Here's an example of how to manage a basic event, such as when the bot is ready:


```js
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		info(`Ready! Logged in as ${client.user.tag}`);
	},
}
```

#### Breakdown

- **`name`**: Specifies the type of event to handle (e.g., `Events.ClientReady`).
- **`once`**: Indicates whether the event should only be handled once (`true` = once, `false` = multiple times).
- **`execute`**: Function that contains the logic to run when the event is triggered. For the `ClientReady` event, it logs a message indicating the bot is online.


### 🛠️ Interactive components: Manage buttons, select menus, context menus, modals, and autocomplete effortlessly.

Manage buttons, select menus, context menus, modals, and autocomplete with ease. 

#### Example: Button Interaction

Here's how you can set up a simple button interaction handler:

```js
module.exports = {
    customId: 'example-button-id',
    run: async (client, interaction) => {

        await interaction.reply({
            content: 'Replied from a Button interaction!',
            ephemeral: true
        });

    }
}
```

#### Breakdown

- **`customId`**: A unique identifier for the button, used to distinguish different buttons in your bot.
- **`run`**: The function that executes when the button is clicked. It contains the logic for handling the interaction.

### 🗨️ Message Reactions & Mentions: Seamlessly react to messages and handle bot mentions.

**File Structure:**

```
messagesReactions/
├─ messagesReaction.js
├─ onBotMention.js
└─ randomMessages.js
```

#### onBotMention.js

Contains a single function that handles what happens when the bot is mentioned in a message. 

#### randomMessages.js

Contains a switch case to handle different random messages. You can customize it to perform various actions based on the message content.

#### messagesReaction.js

Combines the functionalities of `onBotMention.js` and `randomMessages.js`. You can also add functions from other files if you want to include more functionalities beyond just random messages.

### 🌐 Multilingual support: Users can select their preferred language for bot responses.

This feature allows users to choose their preferred language for bot responses. The bot retrieves and uses language-specific texts based on each user's settings.

**File Structure:**

```
langs/
├─ texts/
│  ├─ en.js
│  ├─ fr.js
│  └─ ... (additional language files)
└─ langs.js
```
You can find next to lang an exemple of the user table.

You can add a language just by adding a file `languagename`.js\
⚠️ if you change a language name or remove one, you can have issues with the database

#### Overview

**`Txt` Class**

The `Txt` class is used to manage user language settings and retrieve localized texts. It provides methods for initializing user language settings, retrieving localized texts, changing the language, and more.

**Key Methods:**

- **`init(userid)`**: Initializes the language setting for a user. It fetches the language from the database and sets it, defaulting to a predefined language if needed.

- **`get(command, text, objects)`**: Retrieves the localized text for a given command and text index. If the text is not found in the user's language, it falls back to the default language. Optionally, you can replace placeholders in the text with values from the `objects`.

- **`changeLanguage(lang)`**: Changes the user's language in the database and updates the current language setting.

- **`getLanguage()`**: Retrieves the current language of the user from the database.

**Example Usage:**

```js
const { Txt } = require('./langs');

// Initialize Txt instance for a user
let text = new Txt();
await text.init('user-id-here');

// Get localized text for a command
const localizedText = text.get('commandName', 'textIndex', { VARIABLE: 'value' });

// Change user language
await text.changeLanguage('fr'); // Change to French
```


In this setup:
- **`langs/texts/`** contains language files for different languages.
- **`Txt` class** handles language management and localization.


### 🗄️ MySQL Integration: Connects with MySQL Databases for Data Storage and Management

This feature provides an easy way to connect to and interact with a MySQL database. It allows for executing SQL queries and managing database connections.

**File: `SQLRequest.js`**

**Key Components:**

- **`DatabaseConnection` Class**: Manages database connections and SQL queries. By default, it uses the database configuration from the `.env` file, but you can configure it to use different databases if needed.

**Class Methods:**

- **`setDB(database, host, user, password)`**: Allows you to change the default database connection settings. This method updates the configuration with the provided database name, host, user, and password.

- **`request(sql, params)`**: Executes a SQL query with the given parameters. It returns a promise that resolves with the result of the query.

**Example Usage:**

**1. Default Database Connection**

```js
const DatabaseConnection = require('./SQLRequest');

const db = new DatabaseConnection();

db.request("SELECT * FROM users WHERE id = ?", [userId])
    .then(results => {
        console.log(results);
    })
    .catch(err => {
        console.error(err);
    });
```

**2. Custom Database Connection**

```js
const DatabaseConnection = require('./path/to/DatabaseConnection');

const db = new DatabaseConnection();
db.setDB('otherDatabase', 'host', 'user', 'password');

db.request("SELECT * FROM users WHERE id = ?", [userId])
    .then(results => {
        console.log(results);
    })
    .catch(err => {
        console.error(err);
    });
```

**Class Overview:**

- **`constructor`**: Sets up the connection using environment variables defined in the `.env` file.
- **`setDB`**: Updates the connection settings for different databases.
- **`request`**: Performs SQL queries and handles results or errors, providing debugging information for successful and failed requests.


This integration simplifies database operations, making it easy to perform queries and manage data within your bot.

### 🎨 Easy Embed Creation: Quickly Create and Customize Rich Messages

The `DefaultEmbed` class makes it simple to create rich embed messages in Discord bots with consistent styling. It builds on the `EmbedBuilder` from Discord.js, letting you set default properties like color, footer, author, and thumbnail with just a few lines of code.

**File: `DefaultEmbeds.js`**

**Key Features:**

- **`DefaultEmbed` Class**: Extends `EmbedBuilder` to easily apply default settings, ensuring a uniform look for your embeds.

**Main Method:**

- **`setDefault(embed, message)`**: Applies default settings (color, footer, author, etc.) based on predefined configurations. It uses dynamic placeholders (e.g., server name, user avatar) that are filled in from the message context.

**Example Usage:**

```js
const { DefaultEmbed } = require('./DefaultEmbeds');

const embed = new DefaultEmbed()
    .setDefault('primary', message)
    .setTitle('Custom Title')
    .setDescription('Custom Description');

message.channel.send({ embeds: [embed] });
```

#### Config example
```js
const embeds = {
    primary: {
        color: "#dbaf00",
        header: {
            author: "%SERVER_NAME%",
            authorImageURL: "%SERVER_IMAGE%",
            authorURL: "https://exemple.com",
            thumbnai: "https://c.clc2l.com/t/d/i/discord-4OXyS2.png"
        },
        footer: {
            text: "Secondary exemple",
            imageURL: "",
            timestamp: true,
        }
    }
}
```


### 🌐 Webhook Management: Simplified Webhook Registration, Handling, and Sending

The `WebhookMessage` class provides a straightforward way to manage Discord webhooks, allowing for easy registration, handling, and sending of messages through webhooks. This class ensures that webhooks are efficiently reused or created as needed, with the ability to store and retrieve webhook information from a database.

**File: `WebhookMessage.js`**

**Main Methods:**

1. **`init(message)`**: Initializes a webhook for the specified channel. If a webhook already exists, it is reused; otherwise, a new webhook is created and saved in the database.
   - **Parameters**: `message` - The Discord message object.
   - **Returns**: `Promise<boolean>` - Resolves to `true` if the webhook was successfully initialized.

   **Example Usage:**

   ```js
   const result = await webhookMessage.init(message);
   if (result) {
       console.log('Webhook initialized successfully.');
   } else {
       console.log('Failed to initialize webhook.');
   }
   ```

2. **`send(username, icon, content, embed)`**: Sends a message through the initialized webhook.
   - **Parameters**:
     - `username` - The name to display as the sender.
     - `icon` - The avatar URL for the sender.
     - `content` - The message content.
     - `embed` (optional) - An array of embeds to include in the message.
   - **Returns**: `Promise<boolean>` - Resolves to `true` if the message was sent successfully, or rejects with an error.

   **Example Usage:**

   ```js
   webhookMessage.send('Bot Name', 'https://example.com/avatar.png', 'Hello, world!', [])
       .then(() => console.log('Message sent successfully.'))
       .catch(err => console.error('Failed to send message:', err));
   ```





## Inspirations

Structure and commands registration inspired by - [TFAGaming DiscordJS-V14-Bot-Template](https://github.com/TFAGaming/DiscordJS-V14-Bot-Template/tree/main)
