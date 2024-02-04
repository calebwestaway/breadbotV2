// channelScanner.js
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs/promises');

async function scanChannels(client, maxAttempts, attempt = 1) {
    console.log('Channel scan attempt: ' + attempt);

    async function saveChannelsData() {
        try {
            const guilds = client.guilds.cache;
            const channelsData = {};

            guilds.forEach((guild) => {
                const guildChannels = guild.channels.cache.filter((channel) => channel.type === 0);

                const channelsInGuild = {};
                guildChannels.forEach((channel) => {
                    channelsInGuild[channel.name] = channel.id;
                });

                channelsData[guild.name] = {
                    serverId: guild.id,
                    channels: channelsInGuild,
                };
            });

            const jsonData = JSON.stringify(channelsData, null, 2);

            await fs.writeFile('channels.json', jsonData);

            console.log('Scanned channels saved!');
        } catch (error) {
            console.error('Error in saveChannelsData:', error.message);
            throw error;
        }
    }

    if (client) {
        try {
            await saveChannelsData();
            return;
        } catch (error) {
            console.error('Error in scanChannels:', error.message);
            throw error;
        }
    } else {
        attempt++;

        if (attempt <= maxAttempts) {
            setTimeout(() => {
                scanChannels(client, maxAttempts, attempt); // Pass the updated attempt value
            }, 1000);
        } else {
            console.error('Max attempts for client to be available reached!');
        }
    }
}

if (require.main === module) {
    // Read the token from config.json
    const config = require('../config.json');
    const token = config.token;

    // Initialize the Discord client
    const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

    client.once('ready', () => {
        console.log('Bot is ready!');
        scanChannels(client, 5).then(() =>
            console.log('Finished!'),
            client.destroy(token)
        );
    });

} else {
    module.exports = scanChannels;
}
