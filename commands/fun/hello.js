const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hi!')
    .addSubcommand(subcommand => subcommand.setName('there').setDescription('Says hi!'))
    .addSubcommand(subcommand => subcommand.setName('slow').setDescription('Says hi after a while'));
module.exports = {
    data: data,
    async execute(interaction) {
        if (interaction.options.getSubcommand() === 'slow') {
            await interaction.deferReply();
            await wait(8000);
            await interaction.editReply('**AAAAH!**');
            await wait(1000);
            await interaction.editReply('uhhh I mean');
            await wait(2000);
            await interaction.editReply("Hello! I'm Bot Bread");
            await wait(1000);
            await interaction.editReply("oh wait that's not right");
            await wait(1000);
            await interaction.editReply("Hello! I'm Bread Bot");
            await wait(1000);
            await interaction.editReply("Hello! I'm Bread Bot\n*sorry about that I kinda fell asleep*");
            await wait(4000);
            await interaction.editReply('*zzzz*');
        } else {
            await interaction.reply("Hello! I'm Bread Bot");
        }
    },
};
