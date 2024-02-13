const { SlashCommandBuilder, ActivityType } = require('discord.js');

const { client } = require('../../index.js')

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName('activity')
        .setDescription('Tell Bread Bot to do something')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of activity Bread Bot should do')
                .setRequired(true)
                .addChoices(
                    { name: 'Playing', value: 'playing' },
                    { name: 'Watching', value: 'watching' },
                    { name: 'Listening to', value: 'listening' },
                    { name: 'Competing in', value: 'competing' },
                    { name: 'None', value: 'none' }
                ))

        .addStringOption(option =>
            option.setName('activity')
                .setDescription('What Bread Bot should do. Leave blank if type is set to None`')
        ),

    async execute(interaction) {
        if (interaction.options.getString('type') != 'none') {

            if (interaction.options.getString('activity')) {
                if (interaction.options.getString('type') == 'playing') {
                    client.user.setActivity(interaction.options.getString('activity'));
                    interaction.reply('Now playing `' + interaction.options.getString('activity') + '`');

                } else if (interaction.options.getString('type') == 'watching') {
                    client.user.setActivity(interaction.options.getString('activity'), { type: ActivityType.Watching });
                    interaction.reply('Now watching `' + interaction.options.getString('activity') + '`');

                } else if (interaction.options.getString('type') == 'listening') {
                    client.user.setActivity(interaction.options.getString('activity'), { type: ActivityType.Listening });
                    interaction.reply('Now listening to `' + interaction.options.getString('activity') + '`');

                } else if (interaction.options.getString('type') == 'competing') {
                    client.user.setActivity(interaction.options.getString('activity'), { type: ActivityType.Competing });
                    interaction.reply('Now competing in `' + interaction.options.getString('activity') + '`');
                }

            } else {
                interaction.reply('You haven\'t told me what to do!');
            }

        } else {
            if (Object.keys(client.user.presence.activities).length === 0) {
                interaction.reply('I\'m already not doing anything');

            } else {
                if (client.user.presence.activities[0].type === 0) {
                    interaction.reply('No longer playing `' + client.user.presence.activities[0].name + '`');

                } else if (client.user.presence.activities[0].type === 3) {
                    interaction.reply('No longer watching `' + client.user.presence.activities[0].name + '`');

                } else if (client.user.presence.activities[0].type === 2) {
                    interaction.reply('No longer listening to `' + client.user.presence.activities[0].name + '`');

                } else if (client.user.presence.activities[0].type === 5) {
                    interaction.reply('No longer competing in `' + client.user.presence.activities[0].name + '`');
                }

                client.user.setActivity();
            }
        }
    }
}
