const settings = {
    development: {
        enabled: false, // If true, the bot will register all application commands to a specific guild (not globally).
        guildIds: ["727581589537554534"],
        debug: true, // Display or not more info
        logFile: true
    },
    commands: {
        prefix: "!mc" // Default prefix of the command messages.
    },
    users: {
        ownerId: "516993045724528663", // The bot owner ID, which is you.
    },
    messages: { // Messages when language is unreachable.
        defaultLang: "fr",
        DATABASE_ERROR: "A database error orccured"
    },
    bot: { // Useless if you don't use webhooks
        name: "Mr puant",
        icon: "https://c.clc2l.com/t/d/i/discord-4OXyS2.png"
    },
    status: {
        statusMessages: [
            { name: 'les joueurs', type: 3 },
            { name: '%players%/999 connectés', type: 4 },
        ],
        switch_delay: 10000,
    }
}


const globalEmbedHeader = {
    author: "%SERVER_NAME%",
    authorImageURL: "%SERVER_IMAGE%",
    authorURL: "https://exemple.com",
    thumbnail: "https://c.clc2l.com/t/d/i/discord-4OXyS2.png"
}

const globalEmbedFooter = {
    text: "%USER_NAME%",
    imageURL: "%USER_IMAGE%",
    timestamp: true,
}

const embeds = {
    primary: {
        color: "#dbaf00",
        header: globalEmbedHeader,
        footer: globalEmbedFooter,
    },
    secondary: {
        color: "#00b3db",
        header: globalEmbedHeader,
        footer: {
            text: "Secondary exemple",
            imageURL: "",
            timestamp: true,
        },
    },
}

module.exports = { settings, embeds };