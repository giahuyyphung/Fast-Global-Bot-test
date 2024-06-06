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
    if (message.channel.id !== '1248240086366027827') return;

    // Tạo một trò chơi mới nếu chưa có
    if (!games.has(message.channel.id)) {
        games.set(message.channel.id, new CountingGame(message.channel));
    }

    const game = games.get(message.channel.id);

    // Xử lý tin nhắn cho trò chơi đếm số
    game.handleMessage(message);
});
