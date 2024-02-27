const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    guildDeploy: true,
    data: new SlashCommandBuilder()
        .setName('timeout-me')
        .setDescription('Times you out')
        .addIntegerOption(option =>
            option
                .setName('time')
                .setDescription('The amount of time you\'ll be timed out for in minutes')
                .setRequired(true)
                .setMaxValue(60)),

    async execute(interaction) {
        await interaction.reply('Timing out user');

        const time = await interaction.options.getInteger('time') * 60000;
        const member = await interaction.member

        member.timeout(time);
    },
}
