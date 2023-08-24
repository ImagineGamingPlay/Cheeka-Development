import { TagType } from '@prisma/client';
import { EmbedBuilder } from 'discord.js';
import { client, prisma } from '../..';
import { ModifiedChatInputCommandInteraction } from '../../types';

export const viewTag = async (
    name: string,
    type: TagType,
    interaction: ModifiedChatInputCommandInteraction
) => {
    const tag = await prisma.tag.findFirst({
        where: {
            name,
            type,
        },
    });

    if (!tag) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${name.toLowerCase()} tag not found!`)
                    .setDescription(
                        'The tag you requested was not found! Please verify the tag name.'
                    )
                    .setColor(client.config.colors.red),
            ],
            ephemeral: true,
        });
        return;
    }
    if (!tag.accepted) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${name.toLowerCase()} tag is under review!`)
                    .setDescription(
                        `${name.toLowerCase()} is being reviewed by the moderators and cannot be accessed right now!`
                    )
                    .setColor(client.config.colors.red),
            ],
        });
        return;
    }
    const { content } = tag;
    interaction.reply({
        content,
    });
};
