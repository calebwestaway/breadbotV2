const { SlashCommandBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
    cooldown: 10,
    data: new SlashCommandBuilder()
        .setName('time')
        .setDescription('Shows the current time in GMT'),
    async execute(interaction) {
        const client = interaction.client
        var time = new Date()

        interaction.reply(`It's currently **${time.getHours()}:${time.getMinutes()}**`);
    },
};

