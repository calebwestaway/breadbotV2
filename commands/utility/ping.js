const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Shows Bread Bot\'s current ping'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        interaction.followUp(`Ping: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
    },
};

