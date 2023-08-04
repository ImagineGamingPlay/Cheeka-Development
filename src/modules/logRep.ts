import { logger } from 'console-wizard';
import { EmbedBuilder, GuildMember } from 'discord.js';
import { client } from '..';
import { idData } from '../data';
import {
    ModifiedChatInputCommandInteraction,
    ModifiedUserContextMenuCommandInteraction,
} from '../types';
import { RepActionType } from '../types/';

export const logRep = async (
    member: GuildMember,
    interaction:
        | ModifiedChatInputCommandInteraction
        | ModifiedUserContextMenuCommandInteraction,
    type: RepActionType
) => {
    const logChannel = await client.channels.fetch(
        idData.channels.repLogChannel
    );
    if (!logChannel) {
        logger.error('RepLogChannel not found!');
        return;
    }
    const desc =
        type === 'ADD'
            ? `${interaction.member} has added reputation to ${member}`
            : type === 'REMOVE'
            ? `Reputation of ${member} has been removed by ${interaction.member}`
            : `Reputation of ${member} has been cleared by ${interaction.member}`;

    const embed = new EmbedBuilder({
        title: 'Reputation Log',
        description: desc,
        timestamp: new Date(),
        color: client.config.colors.white,
    });

    const channel = client.channels.cache.get(idData.channels.repLogChannel);

    if (!channel?.isTextBased()) return;
    channel.send({
        embeds: [embed],
    });
};
