import {
    AutocompleteInteraction,
    ButtonInteraction,
    Interaction,
    StringSelectMenuInteraction,
} from 'discord.js';
import { Event, handleButtons, handleSlashCommands } from '../lib';
import { ModifiedCommandInteraction } from '../types';
import { handleAutocomplete } from '../lib/functions/handleAutocomplete';
import { handleSelectMenu } from '../lib/functions/handleSelectMenu';

export default new Event(
    'interactionCreate',
    async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommands(
                interaction as ModifiedCommandInteraction
            );
            return;
        }
        if (interaction.isButton()) {
            await handleButtons(interaction as ButtonInteraction);
            return;
        }
        if (interaction.isAutocomplete()) {
            await handleAutocomplete(interaction as AutocompleteInteraction);
            return;
        }
        if (interaction.isStringSelectMenu()) {
            await handleSelectMenu(interaction as StringSelectMenuInteraction);
            return;
        }
    }
);
