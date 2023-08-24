import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { client, prisma } from '../..';
import { TagProps } from '../../types';
import { idData } from '../../data';
import { logger } from 'console-wizard';
import { modifyTag } from './modifyTag';

const { channels } = idData;

export const tagModifyRequest = async ({
    name,
    interaction,
    type,
}: Omit<TagProps, 'options' | 'content' | 'ownerId'>) => {
    const tag = await prisma.tag.findUnique({
        where: {
            name,
        },
    });

    if (!tag) {
        interaction.reply({
            content: 'Tag not found!',
            ephemeral: true,
        });
        return;
    }

    const isAdmin = interaction.member.permissions.has(
        PermissionFlagsBits.Administrator
    );

    const ownerId = tag.ownerId;
    const content = tag.content;

    if (!ownerId) {
        await interaction.reply({
            content: 'Owner not found!',
            ephemeral: true,
        });
        return;
    }

    const isTagOwner = await prisma.tag.findFirst({
        where: {
            name,
            ownerId: interaction.user.id,
        },
    });
    if (!isTagOwner && !isAdmin) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Failed to modify tag!')
                    .setDescription(
                        'You are not able to modify this tag as you are neither the owner of the tag nor have sufficient permissions!'
                    )
                    .setColor(client.config.colors.red),
            ],
        });
        return;
    }

    const lowerCasedType = type.toLowerCase();
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`Add a ${lowerCasedType} Tag!`)
                .setDescription(
                    'Send the new content as the next message in this channel to set the content of the code snippet!\n\n*Type `cancel` to cancel.*'
                )
                .setColor(client.config.colors.blurple)
                .setFooter({
                    text: 'You have 15 seconds to send your message',
                }),
        ],
    });

    const userMessage = (
        await interaction.channel
            ?.awaitMessages({
                max: 1,
                time: 15 * 1000,
                errors: ['time'],
                filter: m => m.author.id === interaction.user.id,
            })
            .catch(() => {
                interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Oops, You ran out of time!')
                            .setDescription(
                                "Your tag creation process has been canceled as you did not provide the tag's content in time. Run the command again to restart the process."
                            )
                            .setColor(client.config.colors.red),
                    ],
                });
                return;
            })
    )?.first();
    const channel = interaction.channel;
    if (!channel?.isTextBased()) return;

    if (!name) {
        interaction.reply({
            content: 'Please provide a name for the tag!',
            ephemeral: true,
        });
        return;
    }
    const newContent = userMessage?.content;
    if (!content) {
        interaction.reply({
            content:
                'Please send actual message for the tag. Attachments are not supported!',
            ephemeral: true,
        });
        return;
    }

    if (!newContent) return;

    if (isAdmin) {
        modifyTag(name, newContent);
        interaction.reply(
            "Modified the tag! You're an admin, so you immediately modified it."
        );
        return;
    }

    await prisma.tag.update({
        where: {
            name,
        },
        data: {
            newContent,
        },
    });
    const headers = {
        'Content-Type': 'application/json',
    };
    const oldContentRes = await fetch('https://sourceb.in/api/bins', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            files: [
                {
                    content,
                    name,
                    languageId: 222,
                },
            ],
        }),
    });

    const newContentRes = await fetch('https://sourceb.in/api/bins', {
        method: 'POST',
        headers,
        body: JSON.stringify({
            files: [
                {
                    content: newContent,
                    name,
                    languageId: 222,
                },
            ],
        }),
    });
    const oldContentUrl = await oldContentRes.json();
    const newContentUrl = await newContentRes.json();

    const embed = new EmbedBuilder()
        .setTitle('Tag Update Request')
        .setColor(client.config.colors.blurple)
        .setFields([
            {
                name: 'Name',
                value: `${name}`,
                inline: true,
            },
            {
                name: 'Owner',
                value: `${client.users.cache.get(ownerId)}`,
                inline: true,
            },
            {
                name: 'Type',
                value: `${type.toLowerCase()}`,
                inline: true,
            },
            {
                name: 'Old Content',
                value: `[Click here](https://srcb.in/${oldContentUrl.key})`,
                inline: false,
            },
            {
                name: 'New Content',
                value: `[Click here](https://srcb.in/${newContentUrl.key})`,
                inline: true,
            },
        ]);

    const acceptButton = new ButtonBuilder()
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success)
        .setCustomId(`tagModifyAccept--${tag.id}`);

    const declineButton = new ButtonBuilder()
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`tagModifyDecline--${tag.id}`);
    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [acceptButton, declineButton],
    });

    const tagVerificationChannel = client.channels.cache.get(
        channels.tagVerificationChannelId
    );
    if (!tagVerificationChannel?.isTextBased()) {
        logger.error("'tagVerificationChannel' is not a text channel");
        return;
    }
    tagVerificationChannel.send({
        embeds: [embed],
        components: [row],
    });

    userMessage.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Request Sent!')
                .setDescription(
                    'A request has has been sent to modify your tag! We will notify you when your request has been accepted or declined.'
                )
                .setFooter({
                    text: 'Do NOT ping or DM the moderators to get your tag accepted',
                })
                .setColor(client.config.colors.green),
        ],
    });
};
