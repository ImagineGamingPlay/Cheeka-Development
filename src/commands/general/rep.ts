import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    EmbedBuilder,
    GuildMember,
} from 'discord.js';
import { Command } from '../../lib';
import { addRep } from '../../modules/addRep';
import { logRep } from '../../modules';
import { updateRepLeaderboard } from '../../features';

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
                    required: false,
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
                {
                    name: 'count',
                    type: ApplicationCommandOptionType.Number,
                    description: 'The amount of reps to remove',
                    required: false,
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
            const user = options?.getUser('user') || interaction.user;
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
            });
        }

        if (subcommand === 'add') {
            const member = interaction.options.getMember('user') as GuildMember;
            if (!member) return;
            await addRep(member, interaction);
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
            const member = options?.getMember('user') as GuildMember;
            const count = options?.getNumber('count') || 1;
            if (!member) return;

            await client.prisma.reputation.update({
                where: {
                    userId: member.id,
                },
                data: {
                    count: {
                        decrement: count,
                    },
                },
            });
            const reply = await interaction.reply({
                content: `Removed ${count} reputation from ${member}`,
                ephemeral: true,
            });
            await logRep(member, interaction, reply, 'REMOVE', count);
        }
        if (subcommand === 'clear') {
            const member = options?.getMember('user') as GuildMember;
            if (!member) return;

            await client.prisma.reputation.delete({
                where: {
                    userId: member.id,
                },
            });
            const reply = await interaction.reply({
                content: `Removed all reputations from ${member}`,
                ephemeral: true,
            });
            await logRep(member, interaction, reply, 'CLEAR');
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
        await updateRepLeaderboard();
    },
});
