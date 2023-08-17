import { logger } from 'console-wizard';
import { EmbedBuilder, GuildMember, InteractionResponse } from 'discord.js';
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
    reply: InteractionResponse,
    type: RepActionType,
    count?: number
) => {
    const logChannel = await client.channels.fetch(
        idData.channels.repLogChannel
    );
    if (!logChannel) {
        logger.error('RepLogChannel not found!');
        return;
    }
    const desc = `${
        type === 'ADD'
            ? `${interaction.member} has added reputation to ${member}`
            : type === 'REMOVE'
            ? `${count} Reputation(s) of ${member} has been removed by ${interaction.member}`
            : `Reputation of ${member} has been cleared by ${interaction.member}`
    }\n[Go to Chat](${(await reply.fetch()).url})`;

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
