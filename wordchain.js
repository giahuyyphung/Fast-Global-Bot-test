module.exports = (client) => {
    let currentWord = '';
    const gameChannelId = 'YOUR_CHANNEL_ID_HERE'; // Replace with your channel ID

    client.on('messageCreate', message => {
        if (message.channel.id !== gameChannelId || message.author.bot) return;

        const args = message.content.trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (command === '!startwordchain') {
            if (currentWord) {
                return message.channel.send('The word chain game is already in progress!');
            }
            currentWord = args[0] || 'con';
            return message.channel.send(`Word chain game started! First word: ${currentWord}`);
        }

        if (command === '!endwordchain') {
            if (!currentWord) {
                return message.channel.send('No word chain game is currently running!');
            }
            currentWord = '';
            return message.channel.send('Word chain game ended!');
        }

        if (currentWord && message.content.startsWith(currentWord.slice(-1))) {
            currentWord = message.content;
            message.channel.send(`Next word: ${currentWord}`);
        }
    });
};
