import { StringSelectMenuInteraction, EmbedBuilder } from 'discord.js';
import { getFiles } from '../../utils';
import { CommandType } from '../../types';
import { client } from '../..';
export const handleSelectMenu = async (
    interaction: StringSelectMenuInteraction
) => {
    if (!interaction.customId.startsWith('help_')) return;
    const ownerid = interaction.customId.split('_')[1];
    if (interaction.member?.user.id !== ownerid) {
        return interaction.reply({
            content: 'You are not the owner of this help menu.',
            ephemeral: true,
        });
    }

    const category = interaction.values[0].split('_')[1];
    const commands: CommandType[] = [];
    const commandFiles = getFiles(`${__dirname}/../../commands/`, true).filter(
        file => file.includes(`/commands/${category}`)
    );
    for (const file of commandFiles) {
        const commandClass: CommandType = (await import(file)).default;
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
    await interaction.deferUpdate();
    await interaction.message.edit({ embeds: [messageEmbed] });
};
