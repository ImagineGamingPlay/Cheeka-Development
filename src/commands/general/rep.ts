import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder,
} from 'discord.js';
import { Command } from '../../lib';
import { addRep } from '../../modules/addRep';
import { logRep } from '../../modules';

export default new Command({
    name: 'rep',
    description: 'Add or view reputations',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'add',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Add a reputation',
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The user to repute',
                    required: true,
                },
            ],
        },
        {
            name: 'view',
            type: ApplicationCommandOptionType.Subcommand,
            description: "View someone's reputation",
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The target user',
                    required: true,
                },
            ],
        },
        {
            name: 'remove',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'remove one reputation from target',
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The target user',
                    required: true,
                },
            ],
        },
        {
            name: 'clear',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'remove all reputations from target',
            options: [
                {
                    name: 'user',
                    type: ApplicationCommandOptionType.User,
                    description: 'The target user',
                    required: true,
                },
            ],
        },
        {
            name: 'purge',
            type: ApplicationCommandOptionType.Subcommand,
            description: 'Delete all reps',
        },
    ],
    run: async ({ client, interaction, options }) => {
        const subcommand = options?.getSubcommand();

        if (subcommand === 'view') {
            const user = options?.getUser('user');
            if (!user) return;
            if (user.bot) {
                await interaction.reply({
                    content: "Welp... bots don't really have reputations..",
                    ephemeral: true,
                });
            }

            const reputation = await client.prisma.reputation.findUnique({
                where: {
                    userId: user.id,
                },
            });

            if (!reputation) {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder({
                            description: `***${user} has no reputations***`,
                            color: client.config.colors.blurple,
                        }),
                    ],
                    ephemeral: true,
                });
                return;
            }
            await interaction.reply({
                embeds: [
                    new EmbedBuilder({
                        description: `***${user} has ${
                            reputation.count
                        } reputation${reputation.count === 1 ? '' : 's'}***`,
                        color: client.config.colors.blurple,
                    }),
                ],
                ephemeral: true,
            });
        }

        if (subcommand === 'add') {
            const user = options?.getUser('user');

            if (!user?.id) return;
            if (user.bot) {
                await interaction.reply({
                    content: "Welp... bots don't really have reputations..",
                    ephemeral: true,
                });
            }

            if (user.id === interaction.user.id) {
                await interaction.reply({
                    content: 'You cannot add reputation to yourself!',
                    ephemeral: true,
                });
                return;
            }
            await addRep(user.id, interaction);
            await logRep(user, interaction, 'ADD');

            await interaction.reply({
                embeds: [
                    new EmbedBuilder({
                        title: 'Reputation Added!',
                        description: `You have added reputation to ${user}!`,
                        footer: {
                            text: 'Only add reputation to people who helped you. False reputations will be removed the the user will be punished.',
                        },
                        color: client.config.colors.green,
                    }),
                ],
                ephemeral: false,
            });
        }

        if (
            subcommand === 'remove' ||
            (subcommand === 'clear' &&
                !interaction.member.permissions.has('Administrator'))
        ) {
            await interaction.reply({
                content:
                    'You do NOT have sufficient permissions to perform this action!',
                ephemeral: true,
            });
            return;
        }
        if (subcommand === 'remove') {
            const user = options?.getUser('user');
            if (!user) return;
            if (user.bot) {
                await interaction.reply({
                    content: "Welp... bots don't really have reputations..",
                    ephemeral: true,
                });
            }

            await client.prisma.reputation.update({
                where: {
                    userId: user.id,
                },
                data: {
                    count: {
                        decrement: 1,
                    },
                },
            });
            await interaction.reply({
                content: `Removed 1 reputation from ${user}`,
                ephemeral: true,
            });
            await logRep(user, interaction, 'REMOVE');
        }
        if (subcommand === 'clear') {
            const user = options?.getUser('user');
            if (!user) return;
            if (user.bot) {
                await interaction.reply({
                    content: "Welp... bots don't really have reputations..",
                    ephemeral: true,
                });
            }

            await client.prisma.reputation.delete({
                where: {
                    userId: user.id,
                },
            });
            await interaction.reply({
                content: `Removed all reputations from ${user}`,
                ephemeral: true,
            });
            await logRep(user, interaction, 'CLEAR');
        }
        if (subcommand === 'purge') {
            if (interaction.member.id !== client.config.ownerId) {
                await interaction.reply({
                    content:
                        'You do NOT have sufficient permissions to perform this action!',
                    ephemeral: true,
                });
                return;
            }
            await client.prisma.reputation.deleteMany();
        }
    },
});
