import { EmbedBuilder, GuildMember } from 'discord.js';
import { client } from '..';
import { manageRepRole } from '../features';
import { logRep } from './logRep';
import {
    ModifiedChatInputCommandInteraction,
    ModifiedUserContextMenuCommandInteraction,
} from '../types';
import { repCooldownCache } from '../utils/Cache';

export const addRep = async (
    member: GuildMember,
    interaction:
        | ModifiedChatInputCommandInteraction
        | ModifiedUserContextMenuCommandInteraction
) => {
    if (member.id === interaction.member.id) {
        await interaction.reply({
            content: 'You cannot add reputation to yourself!',
            ephemeral: true,
        });
        return;
    }
    const cooldownTimestamp = repCooldownCache.get(member.id);
    if (cooldownTimestamp) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder({
                    title: 'Failed to add rep',
                    description: 'You are on cooldown!',
                    fields: [
                        {
                            name: 'Expires',
                            value: `<t:${cooldownTimestamp}:R>`,
                        },
                    ],
                    color: client.config.colors.red,
                }),
            ],
        });
        return;
    }

    try {
        const reputation = await client.prisma.reputation.findUnique({
            where: {
                userId: member.id,
            },
        });
        if (!reputation) {
            await client.prisma.reputation.create({
                data: {
                    count: 0,
                    userId: member.id,
                },
            });
        }
        await client.prisma.reputation.update({
            where: {
                userId: member.id,
            },
            data: {
                count: {
                    increment: 1,
                },
            },
        });
    } catch (err) {
        await interaction.reply({
            content: 'An enexpected error occured!',
            ephemeral: true,
        });
    }

    await logRep(member, interaction, 'ADD');
    await manageRepRole(member, interaction);

    const cooldownTime = client.config.repCooldownMS || 3 * 60 * 60 * 1000;

    repCooldownCache.set(
        member.id,
        Math.floor((Date.now() + cooldownTime) / 1000)
    );
    setTimeout(() => repCooldownCache.delete(member.id), cooldownTime);

    await interaction.reply({
        embeds: [
            new EmbedBuilder({
                title: 'Reputation Added!',
                description: `You have added reputation to ${member}!`,
                footer: {
                    text: 'Only add reputation to people who helped you.',
                },
                color: client.config.colors.green,
            }),
        ],
    });
};
