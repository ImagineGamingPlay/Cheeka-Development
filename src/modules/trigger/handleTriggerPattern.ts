import { prisma } from '../..';
import { ModifiedChatInputCommandInteraction } from '../../types';

export const handleTriggerPattern = async (
    interaction: ModifiedChatInputCommandInteraction
) => {
    const subcommand = interaction.options.getSubcommand();

    const type = interaction.options.getString('type');
    const pattern = interaction.options.getString('pattern');

    if (!type) return;
    if (!pattern) return;

    const isRegex = pattern.startsWith('/');

    if (subcommand === 'add') {
        if (isRegex) {
            await prisma.trigger.update({
                where: {
                    type,
                },
                data: {
                    regexMatch: {
                        push: pattern,
                    },
                },
            });
        } else {
            await prisma.trigger.update({
                where: {
                    type,
                },
                data: {
                    stringMatch: {
                        push: pattern,
                    },
                },
            });
        }
        await interaction.followUp({
            content: `Added new **${type}** pattern: \`${pattern}\``,
        });
    }
    if (subcommand === 'delete') {
        const trigger = await prisma.trigger.findUnique({ where: { type } });
        const array = isRegex ? trigger?.regexMatch : trigger?.stringMatch;
        const index = array?.indexOf(pattern);

        if (!index || index === -1) return;
        array?.splice(index, 1);

        if (isRegex) {
            await prisma.trigger.update({
                where: {
                    type,
                },
                data: {
                    regexMatch: {
                        set: array,
                    },
                },
            });
        } else {
            await prisma.trigger.update({
                where: {
                    type,
                },
                data: {
                    stringMatch: {
                        set: array,
                    },
                },
            });
        }
        await interaction.followUp({
            content: `Deleted **${type}** pattern: \`${pattern}\``,
        });
    }
};
