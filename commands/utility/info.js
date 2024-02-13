const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or a server')
    .addSubcommand(subcommand =>
        subcommand
            .setName('user')
            .setDescription('Stalks you and says what it found out')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('server')
            .setDescription('Gets info about the server')
    )
    .setDMPermission(false);

module.exports = {
    data: data,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'user') {
            await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
        } else if (interaction.options.getSubcommand() === 'server') {
            await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
        }
    },
};