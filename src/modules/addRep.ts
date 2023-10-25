import { EmbedBuilder, GuildMember } from 'discord.js';
import { client, prisma } from '..';
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
    if (member.user.bot) {
        await interaction.reply({
            content: 'You may not add reputation to bots.',
            ephemeral: true,
        });
        return;
    }
    const cooldownTimestamp = repCooldownCache.get(interaction.member.id);

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
        const reputation = await prisma.reputation.findUnique({
            where: {
                userId: member.id,
            },
        });
        if (!reputation) {
            await prisma.reputation.create({
                data: {
                    count: 0,
                    userId: member.id,
                },
            });
        }
        await prisma.reputation.update({
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

    await manageRepRole(member, interaction);

    const cooldownTime = client.config.repCooldownMS || 3 * 60 * 60 * 1000;

    repCooldownCache.set(
        interaction.member.id,
        Math.floor((Date.now() + cooldownTime) / 1000)
    );
    setTimeout(
        () => repCooldownCache.delete(interaction.member.id),
        cooldownTime
    );

    const reply = await interaction.reply({
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
    await logRep(member, interaction, reply, 'ADD');
};
