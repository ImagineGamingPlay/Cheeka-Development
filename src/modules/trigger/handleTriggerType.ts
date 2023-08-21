import { prisma } from '../..';
import { ModifiedChatInputCommandInteraction } from '../../types';

export const handleTriggerType = async (
    interaction: ModifiedChatInputCommandInteraction
) => {
    const subcommand = interaction.options.getSubcommand();

    const type = interaction.options.getString('name');
    if (!type) return;

    const replyMessageContent = interaction.options.getString('reply_message');

    const config = await prisma.config.findFirst();
    if (!config) return;

    if (subcommand === 'add') {
        if (!replyMessageContent) return;

        await prisma.trigger.create({
            data: {
                type,
                replyMessageContent,
                config: { connect: config },
            },
        });
        await interaction.followUp({
            content: `Added ${type} trigger!.\n**Content:**\n${replyMessageContent}`,
        });
        return;
    }
    if (subcommand === 'modify') {
        if (!replyMessageContent) return;

        await prisma.trigger.update({
            where: { type },
            data: { replyMessageContent },
        });
        await interaction.followUp({
            content: `Updated ${type} trigger's content to:\n${replyMessageContent}`,
        });
        return;
    }
    if (subcommand === 'delete') {
        await prisma.trigger.delete({
            where: { type },
        });
        await interaction.followUp({
            content: `Deleted ${type} trigger!`,
        });
        return;
    }
};
