const settings = {
    development: {
        enabled: false, // If true, the bot will register all application commands to a specific guild (not globally).
        guildIds: ["Development Guild", "Another dev guild"],
        debug: true, // Display or not more info
        logFile: true
    },
    commands: {
        prefix: "?" // Default prefix of the command messages.
    },
    users: {
        ownerId: "Your account ID", // The bot owner ID, which is you.
    },
    messages: { // Messages when language is unreachable.
        defaultLang: "en",
        DATABASE_ERROR: "A database error orccured"
    },
    bot: { // Useless if you don't use webhooks
        name: "Your bot name",
        icon: "https://c.clc2l.com/t/d/i/discord-4OXyS2.png"
    },
    status: {
        statusMessages: [
            { name: 'Status 1', type: 3 },
            { name: 'Status 2', type: 4 },
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