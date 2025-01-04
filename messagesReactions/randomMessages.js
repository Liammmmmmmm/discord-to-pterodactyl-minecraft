function randomMessages(client, message) {
    switch(message.content) {
        case 'Hello':
            message.reply("Hi");
            break;
        case 'Test':
            message.reply("Yes thats a test");
            break;
        default:
            break;
    }
}

module.exports = randomMessages;