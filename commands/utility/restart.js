const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
const wait = require('node:timers/promises').setTimeout;


module.exports = {
    data: new SlashCommandBuilder()
        .setName('restart')
        .setDescription('Restarts Bread Bot'),
    async execute(interaction) {
        const client = interaction.client

        if (process.env.PM2_HOME) {
            await interaction.reply('Restarting...');

            exec('pm2 restart breadbot', (error, stdout, stderr) => {
                if (error) {
                    interaction.followUp(`Error: ${error.message}`);
                    console.error(`Error restarting: ${error.message}`);
                    return;
                }

                if (stderr) {
                    interaction.followUp(`Error: ${stderr}`);
                    console.error(`Error restarting: ${stderr}`);
                    return;
                }

                console.log(`Output: ${stdout}`);
            });
        } else {
            await interaction.reply('I can\'t restart so I\'m going to shutdown instead\nI have messaged Caleb so they can restart me');
            await client.users.send('1164617800443236414', 'I\'m shutting down, please restart me manually');
            client.user.setStatus('invisible')
            wait(1500);
            console.log('Shutting down...')
            client.destroy()
            process.exit()
        }
    },
};
