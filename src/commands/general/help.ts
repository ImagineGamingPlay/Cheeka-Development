import {
    ActionRowBuilder,
    ApplicationCommandOptionType,
    EmbedBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import { Command } from '../../lib/classes/Command';
import { getFiles } from '../../utils';
import { CommandType } from '../../types';
import * as path from 'path';
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
        const categories = getFiles(`${__dirname}/../../commands`, false).map(
            obj => obj.split('/').pop()
        );
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
        } else {
            const commands: CommandType[] = [];
            const commandsFiles = getFiles(
                `./src/commands`, true
            ).filter(
                dir => dir.includes(`/commands/${category}`)
            );
            for (const file of commandsFiles) {
                const filePath = path.resolve(__dirname, '..', file).replace('/src/commands', '')
                const commandClass: CommandType = (await import(filePath)).default;
                const { ...command } = commandClass;

                commands.push(command);
            }
            let commandsData = '';
            for (let i = 0; i < commands.length; i++) {
                const command = commands[i];
                commandsData += `**${command.name}** - ${command.description}\n`;
            }
            const messageEmbed = new EmbedBuilder()
                .setTitle(`Help | ${category}`)
                .setDescription(commandsData)
                .setColor(client.config.colors.blurple);

            await interaction.followUp({
                embeds: [messageEmbed],
            });
        }
    },
});
