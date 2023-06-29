import {
    AutocompleteInteraction,
    ButtonInteraction,
    Interaction,
} from 'discord.js';
import { Event, handleButtons, handleSlashCommands } from '../lib';
import { ModifiedCommandInteraction } from '../types';
import { handleAutocomplete } from '../lib/functions/handleAutocomplete';

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
    }
);
