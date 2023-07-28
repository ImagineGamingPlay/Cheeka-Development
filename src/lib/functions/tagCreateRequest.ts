import { logger } from 'console-wizard';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import { client } from '../..';
import { idData } from '../../data';
import { TagProps } from '../../types';

const { channels } = idData;

export const tagCreateRequest = async ({
    name,
    type,
    interaction,
}: Omit<TagProps, 'ownerId' | 'content'>) => {
    const {
        prisma,
        config: { colors },
    } = client;

    const alreadyExists = await prisma.tag.findUnique({
        where: {
            name,
        },
    });
    if (alreadyExists) {
        interaction.reply({
            content: 'That tag already exists! Please choose a unique name',
            ephemeral: true,
        });
        return;
    }

    const lowerCasedType = type.toLowerCase();
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle(`Add a ${lowerCasedType} Tag!`)
                .setDescription(
                    'Send the tag content as the next message in this channel to set the content of the code snippet!\n\n*Type `cancel` to cancel.*'
                )
                .setColor(colors.blurple)
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
                            .setColor(colors.red),
                    ],
                });
                return;
            })
    )?.first();
    const channel = interaction.channel;
    if (!channel?.isTextBased()) return;

    const ownerId = interaction.user.id;
    if (!name) {
        interaction.reply({
            content: 'Please provide a name for the tag!',
            ephemeral: true,
        });
        return;
    }
    const content = userMessage?.content;
    if (!content) {
        interaction.reply({
            content:
                'Please send actual message for the tag. Attachments are not supported!',
            ephemeral: true,
        });
        return;
    }
    if (content.toLowerCase() === 'cancel') return;

    if (content.length > 2000) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Failed to create tag!')
                    .setDescription(
                        'The content cannot have more than 2000 characters!'
                    )
                    .setColor(client.config.colors.red),
            ],
            ephemeral: true,
        });
        return;
    }

    const tag = await client.prisma.tag.create({
        data: {
            name,
            content,
            accepted: false,
            type,
            ownerId,
        },
    });
    const tagVerificationChannel = client.channels.cache.get(
        channels.tagVerificationChannelId
    );
    if (!tagVerificationChannel?.isTextBased()) {
        logger.error("'tagVerificationChannel' is not a text channel");
        return;
    }

    const formData = JSON.stringify({
        files: [
            {
                content,
                name,
                languageId: 222,
            },
        ],
    });
    const headers = {
        'Content-Type': 'application/json',
    };
    const res = await fetch('https://sourceb.in/api/bins', {
        method: 'POST',
        body: formData,
        headers,
    });
    const contentUrl = await res.json();

    const embed = new EmbedBuilder().setTitle('New tag request').setFields([
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
            name: 'Content',
            value: `[Click here](https://srcb.in/${contentUrl.key})`,
            inline: true,
        },
    ]);

    const acceptButton = new ButtonBuilder()
        .setLabel('Accept')
        .setStyle(ButtonStyle.Success)
        .setCustomId(`tagAccept--${tag.id}`);

    const declineButton = new ButtonBuilder()
        .setLabel('Decline')
        .setStyle(ButtonStyle.Danger)
        .setCustomId(`tagDecline--${tag.id}`);
    const row = new ActionRowBuilder<ButtonBuilder>({
        components: [acceptButton, declineButton],
    });

    tagVerificationChannel.send({
        embeds: [embed],
        components: [row],
    });

    userMessage.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle('Request Sent!')
                .setDescription(
                    'A request has has been sent to create your tag! We will notify you when your tag has been accepted or declined.'
                )
                .setFooter({
                    text: 'Do NOT ping or DM the moderators to get your tag accepted',
                })
                .setColor(client.config.colors.green),
        ],
    });
};
