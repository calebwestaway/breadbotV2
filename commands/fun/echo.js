const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input')
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('The input to echo back')
                .setRequired(true)
                .setMaxLength(100)),

    async execute(interaction) {
        await interaction.reply("Echo:\n> "+interaction.options.getString('input'))
    },
}
