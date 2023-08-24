import { EmbedBuilder } from 'discord.js';
import { client, prisma } from '../..';
import { ModifiedChatInputCommandInteraction } from '../../types';

export const deleteTag = async (
    name: string,
    interaction: ModifiedChatInputCommandInteraction
) => {
    const isTagOwner = await prisma.tag.findFirst({
        where: {
            name,
            ownerId: interaction.user.id,
        },
    });

    const isStaff = interaction.member.roles.cache.has(
        client.config.staffRoleId
    );
    if (!isTagOwner && !isStaff) {
        interaction.reply({
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

    const tag = await prisma.tag.findUnique({
        where: {
            name,
        },
    });
    if (!tag) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tag not found!')
                    .setDescription("The tag wasn't found in the database!")
                    .setColor(client.config.colors.red),
            ],
        });
        return;
    }

    await prisma.tag.delete({
        where: {
            name,
        },
    });

    interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Tag deleted!')
                .setDescription(`Tag ${name} has been deleted!`)
                .setColor(client.config.colors.red),
        ],
    });
};
