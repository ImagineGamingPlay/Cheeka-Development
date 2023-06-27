import { ButtonInteraction } from 'discord.js';
import { client } from '../..';

export const handleButtons = async (interaction: ButtonInteraction) => {
    await interaction.deferReply();

    const { customId } = interaction;
    const idParts = customId.split('--');
    const scope = idParts[0];
    const id = idParts[1];

    const button = client.buttons.get(scope);

    await button?.run({
        interaction,
        id,
        scope,
    });
};
