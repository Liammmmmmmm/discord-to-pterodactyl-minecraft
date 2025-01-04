function randomMessages(client, message) {
    switch(message.content) {
        case 'Nul':
            message.reply(":4983pepediamondsword:");
            break;
        case 'Test':
            message.reply("Yes thats a test");
            break;
        default:
            break;
    }
}

module.exports = randomMessages;