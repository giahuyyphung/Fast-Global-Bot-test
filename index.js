const Discord = require("discord.js");
const http = require("http");
const config = require(`./config.json`);
const CountingGame = require("./count.js");

const client = new Discord.Client({
    shards: "auto",
    allowedMentions: { parse: [], repliedUser: false },
    intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
    ],
});

// Start the Bot
client.login(process.env.token);

// Create a simple HTTP server to avoid port scan timeout error
const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Discord Bot is running\n");
});

// Choose a port to listen on (process.env.PORT for Heroku, or a default port)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`HTTP server listening on port ${PORT}`);
});

// Store game instances for each channel
const games = new Map();

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    // Chỉ xử lý tin nhắn trong kênh quy định
    if (message.channel.id !== '1248243718302208043') return;

    // Tạo một trò chơi mới nếu chưa có
    if (!games.has(message.channel.id)) {
        games.set(message.channel.id, new CountingGame(message.channel));
    }

    const game = games.get(message.channel.id);

    // Xử lý lệnh bắt đầu trò chơi
    if (message.content === '!start') {
        game.startGame();
        return;
    }

    // Xử lý lệnh kết thúc trò chơi
    if (message.content === '!end') {
        game.endGame();
        games.delete(message.channel.id);
        return;
    }

    // Xử lý lệnh reset trò chơi
    if (message.content === '!reset') {
        game.resetGame();
        return;
    }

    // Xử lý tin nhắn đếm số
    if (game.inProgress && !message.author.bot) {
        game.processCount(message);
    }
});
