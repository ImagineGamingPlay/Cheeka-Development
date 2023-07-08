import {
    AutocompleteInteraction,
    ButtonInteraction,
    ContextMenuCommandInteraction,
    Interaction,
} from 'discord.js';
import {
    handleAutocomplete,
    handleButtons,
    handleContextMenus,
    handleSlashCommands,
} from '../handlers/';
import { Event } from '../lib';
import { ModifiedChatInputCommandInteraction } from '../types';

export default new Event(
    'interactionCreate',
    async (interaction: Interaction) => {
        if (interaction.isChatInputCommand()) {
            await handleSlashCommands(
                interaction as ModifiedChatInputCommandInteraction
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

        if (interaction.isContextMenuCommand()) {
            await handleContextMenus(
                interaction as ContextMenuCommandInteraction
            );
        }
    }
);
