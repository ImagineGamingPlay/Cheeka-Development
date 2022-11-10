const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command'),
    async execute(interaction) {
        let commands = Array.from(client.commands.values())
        let categories = commands.reduce((acc, command) => {
            if (!acc[command.category]) {
                acc[command.category] = [];
            }
            acc[command.category].push(command);
            return acc;
        }, {});
        console.log(categories);
        let embed = new MessageEmbed()
            .setColor('BLURPLE')
            .setTitle('Select category')
            .setDescription(
                'Please select a category from the selection menu given below to view commands.',
            );
        let cat = Object.keys(categories).map(category => {
            if (!category) category = `Default`;
            return {
                label: category,
                value: 'help_' + category,
            };
        });
        let menu = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId('help_' + interaction.user.id)
                .setPlaceholder('Nothing selected')
                .addOptions(cat),
        );
        // Send the message embed to the channel and attach a selection menu with all the categories.
        try {
            await interaction.reply({
                embeds: [embed],
                components: [menu],
            });
        } catch (e) {
            return;
        }
    },
};
