import { TagType } from '@prisma/client';
import { Command } from '../../lib/';
import { ApplicationCommandOptionType, Colors, EmbedBuilder } from 'discord.js';

export default new Command({
    name: 'code',
    description: 'View and manage the code snippets!',
    options: [
        {
            name: 'view',
            description: 'add a code snippet!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the code snippet',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'add',
            description: 'add a code snippet!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the code snippet',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'modify',
            description: 'add a code snippet!',
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: 'delete',
            description: 'add a code snippet!',
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    run: async ({ options, client, interaction }) => {
        const subcommand = options?.getSubcommand();
        if (subcommand === 'add') {
            const message_reply = await interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Add a code snippet!')
                        .setDescription(
                            'Send the code snippet in the next message in the same channel to set the content of the code snippet!\n\n*Type `cancel` to cancel.*'
                        ),
                ],
            });
            try {
                const message = (
                    await interaction.channel?.awaitMessages({
                        max: 1,
                        filter: msg => msg.author.id === interaction.user.id,
                        time: 10000,
                    })
                )?.first();
                if (!message) throw new Error('No message was sent!');

                message_reply.delete();
                const name = options?.getString('name', true);
                if (!name) {
                    await interaction.editReply({
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('Code snippet addition cancelled!')
                                .setDescription(
                                    'You did not provide a name for the code snippet!'
                                )
                                .setColor(Colors.Red),
                        ],
                    });
                    return;
                }
                client.prisma.tag.create({
                    data: {
                        content: message?.content,
                        name,
                        type: TagType.CODE,
                        owner: {
                            connectOrCreate: {
                                where: {
                                    discordId: interaction.user.id,
                                },
                                create: {
                                    discordId: interaction.user.id,
                                },
                            },
                        },
                    },
                });
            } catch (error) {
                await interaction.editReply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle('Code snippet addition cancelled!')
                            .setDescription(
                                'You took too long to send the code snippet!'
                            )
                            .setColor(Colors.Red),
                    ],
                });
            }
        }
    },
});
