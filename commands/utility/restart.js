const { SlashCommandBuilder } = require('discord.js');
const { exec } = require('child_process');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder().setName('restart').setDescription('Restarts Bread Bot'),

    async execute(interaction) {
        if (process.env.PM2_HOME) {
            interaction.reply('Restarting...');

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
            interaction.reply('Cannot restart because PM2 is not in use!');
        }

        // interaction.reply("this command is very broken, so you can't use it");
    },
};
