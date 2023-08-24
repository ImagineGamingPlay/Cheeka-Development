import { prisma } from '../..';
import { ModifiedChatInputCommandInteraction } from '../../types';

export const handleTriggerPattern = async (
    interaction: ModifiedChatInputCommandInteraction
) => {
    let exit = false;
    const subcommand = interaction.options.getSubcommand();

    const type = interaction.options.getString('type');
    const pattern = interaction.options.getString('pattern');

    if (!type) return;
    if (!pattern) return;

    const isRegex = pattern.startsWith('/');

    if (subcommand === 'add') {
        if (isRegex) {
            await prisma.trigger
                .update({
                    where: {
                        type,
                    },
                    data: {
                        regexMatch: {
                            push: pattern,
                        },
                    },
                })
                .catch(async () => {
                    await interaction.followUp({
                        content:
                            'Error creating pattern: Make sure there are no types with the same name!',
                    });
                    exit = true;
                });
            if (exit) return;
        } else {
            await prisma.trigger
                .update({
                    where: {
                        type,
                    },
                    data: {
                        stringMatch: {
                            push: pattern,
                        },
                    },
                })
                .catch(async () => {
                    await interaction.followUp({
                        content:
                            'Error creating pattern: Make sure there are no types with the same name!',
                    });
                    exit = true;
                });
        }

        if (exit) return;
        await interaction.followUp({
            content: `Added new **${type}** pattern: \`${pattern}\``,
        });
    }
    if (subcommand === 'delete') {
        const trigger = await prisma.trigger.findUnique({ where: { type } });
        const array = isRegex ? trigger?.regexMatch : trigger?.stringMatch;
        const index = array?.indexOf(pattern);

        if (index === undefined || index === -1) {
            await interaction.followUp({
                content:
                    'Error deleting pattern: Make sure the pattern for that type exists!',
            });
            return;
        }
        array?.splice(index, 1);

        if (isRegex) {
            await prisma.trigger
                .update({
                    where: {
                        type,
                    },
                    data: {
                        regexMatch: {
                            set: array,
                        },
                    },
                })
                .catch(async () => {
                    await interaction.followUp({
                        content:
                            'Error deleting pattern: Make sure the pattern for that type exists!',
                    });
                    exit = true;
                });
            if (exit) return;
        } else {
            await prisma.trigger
                .update({
                    where: {
                        type,
                    },
                    data: {
                        stringMatch: {
                            set: array,
                        },
                    },
                })
                .catch(async () => {
                    await interaction.followUp({
                        content:
                            'Error deleting pattern: Make sure the pattern for that type exists!',
                    });
                    exit = true;
                });
        }
        if (exit) return;
        await interaction.followUp({
            content: `Deleted **${type}** pattern: \`${pattern}\``,
        });
    }
};
