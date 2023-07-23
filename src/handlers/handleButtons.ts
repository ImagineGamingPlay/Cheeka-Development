import { ButtonInteraction } from 'discord.js';
import { client } from '..';
import { ButtonRunParams } from '../types';

export const handleButtons = async (interaction: ButtonInteraction) => {
    await interaction.deferReply();

    const { customId } = interaction;
    const idParts = customId.split('--');
    const scope = idParts[0];
    const id = idParts[1];

    const button = client.buttons.get(scope);

    const args: ButtonRunParams = {
        interaction,
        id,
        scope,
    };

    await button?.run(args);
};
