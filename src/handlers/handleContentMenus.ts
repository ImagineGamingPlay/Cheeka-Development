import { ContextMenuCommandInteraction } from 'discord.js';
import { client } from '..';
import {
    MessageContextMenuRunParams,
    UserContextMenuRunParams,
    ModifiedUserContextMenuCommandInteraction,
    ModifiedMessageContextMenuCommandInteraction,
} from '../types';

export const handleContextMenus = async (
    interaction: ContextMenuCommandInteraction
) => {
    const noDefer = ['ban'];
    if (!noDefer.includes(interaction.commandName)) {
        await interaction.deferReply({ ephemeral: true });
    }

    if (interaction.isUserContextMenuCommand()) {
        const command = client.userContextMenus.get(interaction.commandName);

        if (!command) return;

        const args: UserContextMenuRunParams = {
            client,
            interaction:
                interaction as ModifiedUserContextMenuCommandInteraction,
        };

        await command.run(args);
    }

    if (interaction.isMessageContextMenuCommand()) {
        const command = client.messageContextMenus.get(interaction.commandName);

        if (!command) return;

        const args: MessageContextMenuRunParams = {
            client,
            interaction:
                interaction as ModifiedMessageContextMenuCommandInteraction,
        };

        await command.run(args);
    }
};
