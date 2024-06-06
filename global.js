const Discord = require("discord.js");
const globalChannels = [
    "1245681386648506480",
    "1216985264069541932" // UNAVAILABLE CHANNEL
]; // Define an array of all channels which are a global channel

const staffIds = ["1015763488938938388", "1055695302386012212"]; // Replace with actual staff member IDs
const botStaffIds = ["1112683447366991923"]; // Replace with actual staff bot IDs
const partneredServerIds = ["1079700191634014298"]; // Replace with actual partnered server IDs
const ownerIds = ["1143200917097808044"]; // Replace with actual owner IDs

module.exports = client => {
    // First some supportive buttons!
    let buttonrow = new Discord.MessageActionRow().addComponents([
        new Discord.MessageButton().setStyle("LINK").setURL("https://discord.gg/milrato").setLabel("Support Server"),
        new Discord.MessageButton().setStyle("LINK").setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`).setLabel("Invite me")
    ]);

    // Now let's start!
    // By installing the npm modules!

    client.on("messageCreate", async message => {
        // Return if a message is received from DMs, or an invalid guild, or from a BOT!
        if (!message.guild || message.guild.available === false || message.author.bot) return;
        // If the current channel is a global channel:
        if (globalChannels.includes(message.channel.id)) {
            // The message sending data!
            const messageData = {
                embeds: [],
                components: [buttonrow],
                files: []
            };

            // Define the embed for sending into the channels
            const embed = new Discord.MessageEmbed()
                .setColor("BLURPLE")
                .setAuthor(`${message.author.tag}`, message.member.displayAvatarURL({ dynamic: true, size: 256 }), "https://discord.gg/milrato")
                .setThumbnail(message.member.displayAvatarURL({ dynamic: true, size: 256 })) // Message member could be the USER SERVER SPECIFIC AVATAR too!
                .setFooter(`${message.guild.name}・${message.guild.memberCount} Members`, message.guild.iconURL({ dynamic: true, size: 256 }))
                .setTimestamp()

            // Determine the message content with appropriate coloring
            let messageContent = String(message.content).substr(0, 2000);

            // Check if the message author is the owner and color the text green
            if (ownerIds.includes(message.author.id)) {
                embed.setDescription(`**Message:**\n\n>>> \`\`\`diff\n+ ${messageContent}\`\`\``);
            } else if (staffIds.includes(message.author.id) || botStaffIds.includes(message.author.id) || partneredServerIds.includes(message.guild.id)) {
                embed.setDescription(`**Message:**\n\n>>> \`\`\`yaml\n${messageContent}\`\`\``);
            } else {
                embed.setDescription(`**Message:**\n\n>>> ${messageContent}`);
            }

            // Add icons for staff, bot staff, and partnered servers
            if (staffIds.includes(message.author.id)) {
                embed.setDescription(`<a:hg_king:1080873872578064444> ${embed.description}`);
            }

            if (botStaffIds.includes(message.author.id)) {
                embed.setDescription(`<a:staff:1091010733589930124> ${embed.description}`);
            }

            if (partneredServerIds.includes(message.guild.id)) {
                embed.setDescription(`<a:hg_partner:1212043431459819540> ${embed.description}`);
            }

            // Now let's do the attachments!
            let url = "";
            let imagename = "UNKNOWN";
            if (message.attachments.size > 0) {
                if (message.attachments.every(attachIsImage)) {
                    // Valid Image!!!
                    const attachment = new Discord.MessageAttachment(url, imagename);
                    messageData.files = [attachment]; // Add the image file to the message of the BOT
                    embed.setImage(`attachment://${imagename}`); // Add the image to the embed, so it's inside of it!
                }
            }
            // Function to validate the message attachment image!
            function attachIsImage(msgAttach) {
                url = msgAttach.url;
                imagename = msgAttach.name || `UNKNOWN`;
                return url.indexOf("png", url.length - 3) !== -1 || url.indexOf("PNG", url.length - 3) !== -1 ||
                    url.indexOf("jpeg", url.length - 4) !== -1 || url.indexOf("JPEG", url.length - 4) !== -1 ||
                    url.indexOf("gif", url.length - 3) !== -1 || url.indexOf("GIF", url.length - 3) !== -1 ||
                    url.indexOf("webp", url.length - 3) !== -1 || url.indexOf("WEBP", url.length - 3) !== -1 ||
                    url.indexOf("webm", url.length - 3) !== -1 || url.indexOf("WEBM", url.length - 3) !== -1 ||
                    url.indexOf("jpg", url.length - 3) !== -1 || url.indexOf("JPG", url.length - 3) !== -1;
            }

            // We forgot to add the embed, sorry
            messageData.embeds = [embed];

            // Now it's time for sending the message(s)
            // We need to pass in the message and the messageData (SORRY)
            sendallGlobal(message, messageData);
        }
    });

    // Yes, we made a mistake!
    // This function is for sending the messages in the global channels
    async function sendallGlobal(message, messageData) {
        message.react("🌐").catch(() => {}); // React with a validate emoji
        // message.delete().catch(()=>{}) // OR delete the message...
        // Define a not-in-cache channels array;
        let notincachechannels = [];
        // Send the message back in the same guild
        message.channel.send(messageData).then(msg => {
            // Here you could set database information for that message mapped for the message.author
            // so you can register message edits etc.
        }).catch((O) => {})

        // Loop through all Channels:
        for (const chid of globalChannels) {
            // Get the channel in the cache
            let channel = client.channels.cache.get(chid);
            if (!channel) {
                // If no channel found, continue... but wait! It could mean it is just not in the cache... so fetch it maybe?
                // Yes later, first do all cached channels!
                notincachechannels.push(chid);
                continue;
            }
            if (channel.guild.id != message.guild.id) {
                channel.send(messageData).then(msg => {
                    // Here you could set database information for that message mapped for the message.author
                    // so you can register message edits etc.
                }).catch((O) => {})
            }
        }

        // Loop through all NOT CACHED Channels:
        for (const chid of notincachechannels) {
            // Get the channel in the cache
            let channel = await client.channels.fetch(chid).catch(() => {
                // Channel = false; // The channel will not exist, so maybe remove it from your DB...
                console.log(`${chid} is not available!`)
            });
            if (!channel) {
                continue;
            }
            if (channel.guild.id != message.guild.id) {
                channel.send(messageData).then(msg => {
                    // Here you could set database information for that message mapped for the message.author
                    // so you can register message edits etc.
                }).catch((O) => {})
            }
        }
    }
}

/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
