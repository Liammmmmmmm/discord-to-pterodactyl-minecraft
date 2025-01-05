const settings = {
    development: {
        enabled: false, // If true, the bot will register all application commands to a specific guild (not globally).
        guildIds: ["727581589537554534", "1161392271531458611"],
        debug: true, // Display or not more info
        logFile: true
    },
    commands: {
        prefix: "?" // Default prefix of the command messages.
    },
    users: {
        ownerId: "516993045724528663", // The bot owner ID, which is you.
    },
    messages: { // Messages when language is unreachable.
        defaultLang: "fr",
        DATABASE_ERROR: "A database error orccured"
    },
    bot: { // Useless if you don't use webhooks
        name: "Mr Puant",
        icon: "https://cdn.discordapp.com/icons/1161392271531458611/d4aa2ce36e3b409b8c059c0779fea5c4.webp?size=512"
    },
    status: {
        statusMessages: [
            { name: 'les joueurs', type: 3 },
            { name: 'Cpu: %CPU%% | Mem: %MEM%Gb', type: 4 },
        ],
        switch_delay: 10000,
    }
}


const globalEmbedHeader = {
    author: "%SERVER_NAME%",
    authorImageURL: "%SERVER_IMAGE%",
    authorURL: "https://exemple.com",
    thumbnail: "https://cdn.discordapp.com/icons/1161392271531458611/d4aa2ce36e3b409b8c059c0779fea5c4.webp?size=512"
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