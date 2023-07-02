import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    EmbedBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import { Command } from '../../lib/classes/Command';
import { readdirSync } from 'fs';

export default new Command({
    name: 'help',
    description: 'View the connection status',
    options: [
        {
            name: 'category',
            description: 'Help category',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    run: async ({ interaction, client, options }) => {
        const category = options?.getString('category');
        const categories = readdirSync('./src/commands', {
            withFileTypes: true,
        })
            .filter(dir => dir.isDirectory())
            .map(folders => folders.name);
        if (!category) {
            const helpEmbed = new EmbedBuilder()
                .setTitle(`Select a category`)
                .setDescription(
                    'Please select a category from the selection menu given below.'
                )
                .setColor(client.config.colors.blurple);

            const options = categories.map(category => {
                if (!category) category = 'Default';
                return {
                    label: category,
                    value: `help_${category}`,
                };
            });
            const menu =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`help_${interaction.user.id}`)
                        .setPlaceholder('Nothing selected')
                        .addOptions(options)
                );
            try {
                await interaction.followUp({
                    embeds: [helpEmbed],
                    components: [menu],
                });
            } catch (e) {
                console.log(e);
            }
        }
    },
});
