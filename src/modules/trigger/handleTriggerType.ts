import { prisma } from '../..';
import { ModifiedChatInputCommandInteraction } from '../../types';

export const handleTriggerType = async (
    interaction: ModifiedChatInputCommandInteraction
) => {
    let exit = false;
    const subcommand = interaction.options.getSubcommand();

    const type = interaction.options.getString('name');
    if (!type) return;

    const replyMessageContent = interaction.options.getString('reply_message');

    if (subcommand === 'add') {
        if (!replyMessageContent) return;

        await prisma.trigger
            .create({
                data: {
                    type,
                    replyMessageContent,
                },
            })
            .catch(async () => {
                await interaction.followUp({
                    content:
                        'Error creating type: Make sure there are no types with the same name!',
                });
                exit = true;
            });
        if (exit) return;

        await interaction.followUp({
            content: `Added ${type} trigger!.\n**Content:**\n${replyMessageContent}`,
        });
        return;
    }
    if (subcommand === 'modify') {
        if (!replyMessageContent) return;

        await prisma.trigger
            .update({
                where: { type },
                data: { replyMessageContent },
            })
            .catch(async () => {
                await interaction.followUp({
                    content: 'Error creating type: Make sure the type exists!',
                });
                exit = true;
            });
        if (exit) return;
        await interaction.followUp({
            content: `Updated ${type} trigger's content to:\n${replyMessageContent}`,
        });
        return;
    }
    if (subcommand === 'delete') {
        await prisma.trigger
            .delete({
                where: { type },
            })
            .catch(async () => {
                await interaction.followUp({
                    content: 'Error creating type: Make sure the type exists!',
                });
                exit = true;
            });
        if (exit) return;
        await interaction.followUp({
            content: `Deleted ${type} trigger!`,
        });
        return;
    }
};
