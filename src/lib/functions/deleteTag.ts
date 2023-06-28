import { EmbedBuilder, PermissionFlagsBits } from 'discord.js';
import { client } from '../..';
import { ModifiedCommandInteraction } from '../../types';

export const deleteTag = async (
    name: string,
    interaction: ModifiedCommandInteraction
) => {
    const isTagOwner = await client.prisma.tag.findFirst({
        where: {
            name,
            ownerId: interaction.user.id,
        },
    });

    const isAdmin = interaction.member.permissions.has(
        PermissionFlagsBits.Administrator
    );
    if (!isTagOwner && !isAdmin) {
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Failed to delete tag!')
                    .setDescription(
                        'You are not able to delete this tag as you are neither the owner of the tag nor have sufficient permissions to forcefully delete it!'
                    )
                    .setColor(client.config.colors.red),
            ],
        });
        return;
    }

    const tag = await client.prisma.tag.findUnique({
        where: {
            name,
        },
    });
    if (!tag) {
        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tag not found!')
                    .setDescription("The tag wasn't found in the database!")
                    .setColor(client.config.colors.red),
            ],
        });
        return;
    }

    await client.prisma.tag.delete({
        where: {
            name,
        },
    });

    interaction.followUp({
        embeds: [
            new EmbedBuilder()
                .setTitle('Tag deleted!')
                .setDescription(`Tag ${name} has been deleted!`)
                .setColor(client.config.colors.red),
        ],
    });
};
