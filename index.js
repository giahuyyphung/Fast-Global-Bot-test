const Discord = require("discord.js"); // discord.js v13
const http = require("http");
const config = require(`./config.json`);

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

// We gotta adjust this, so we only require the file once the bot is ready!
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
    // First we need to require the global.js file which we're going to create!
    require("./global.js")(client); // Pass in client to pull the file
});

/**
 * @WELCOME_EVERYONE
 * I AM BACK!
 * Sad news... I updated to Windows 11 and now...
 * my mic is not working anymore... but I don't want to stop making tutorials so here we go!
 * A FAST AND SIMPLE GLOBAL BOT TUTORIAL!
 * 
 * I set up an index file with base data and a config.json with the token and prefix (which we won't need)
 * CODE WILL BE ON: https://github.com/Tomato6966/Simple-Fast-Global-Bot-v13
 */

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
