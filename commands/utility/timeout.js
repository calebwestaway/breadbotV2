const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,
    guildDeploy: true,
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Times out someone')

        .addSubcommand(subcommand =>
            subcommand
                .setName('me')
                .setDescription('Times you out')
                .addIntegerOption(option =>
                    option
                        .setName('time')
                        .setDescription('The amount of time you\'ll be timed out for in minutes')
                        .setRequired(true)
                        .setMaxValue(60))

                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('Why you\'re being timed out')
                        .setRequired(false))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('someone-else')
                .setDescription('Times out someone else')
                .addIntegerOption(option =>
                    option
                        .setName('time')
                        .setDescription('The amount of time the user will be timed out for in minutes')
                        .setRequired(true)
                        .setMaxValue(60))

                .addUserOption(option =>
                    option
                        .setName('target')
                        .setDescription('The member to timeout')
                        .setRequired(true))

                .addStringOption(option =>
                    option
                        .setName('reason')
                        .setDescription('Why they\'re being timed out')
                        .setRequired(false))
        )
        .setDMPermission(false),

    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'me') {

            const time = await interaction.options.getInteger('time') * 60000;
            const member = await interaction.member
            const reason = await interaction.options.getString('reason');

            await interaction.reply('You asked for it...');

            try {
                await member.timeout(time, reason);
            } catch {
                await interaction.followUp('Something broke. <@1164617800443236414> has the details')
            }

        } else if (interaction.options.getSubcommand() === 'someone-else') {
            const interactionUser = await interaction.guild.members.fetch(interaction.user.id)
            console.log()
            if (interactionUser.roles.cache.has('1213237608327553144')) {
                if (interaction.options.getMember('target').id === interaction.client.user.id) {
                    interaction.reply('No')
                } else {
                    const time = await interaction.options.getInteger('time') * 60000;
                    const member = await interaction.options.getMember('target');
                    const reason = await interaction.options.getString('reason');

                    await interaction.reply(`Timing out ${member} for ${time / 60000} minutes`);

                    try {
                        await member.timeout(time, reason);
                    } catch (error) {
                        await interaction.followUp('Something broke. <@1164617800443236414> has the details\nI might not be able to timeout if the target user has `smol admin`')
                        console.log(error);
                    }
                }
            } else {
                interaction.reply('Access denied')
            }

        };
    },
}
