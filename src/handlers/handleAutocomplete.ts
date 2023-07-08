import { AutocompleteInteraction } from 'discord.js';
import { client } from '..';
import { logger } from 'console-wizard';

export const handleAutocomplete = async (
    interaction: AutocompleteInteraction
) => {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        logger.error(
            `No command matching ${interaction.commandName} was found.`
        );
        return;
    }

    if (!command.autocomplete) {
        logger.error(
            `No autocomplete function found for ${interaction.commandName}!`
        );
        return;
    }

    try {
        await command.autocomplete(interaction);
    } catch (error) {
        console.error(error);
    }
};
