import { ButtonInteraction, Interaction } from 'discord.js';
import { Event, handleButtons, handleSlashCommands } from '../lib';
import { ModifiedCommandInteraction } from '../types';

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
    }
);
