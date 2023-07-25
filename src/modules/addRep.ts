import { CommandInteraction } from 'discord.js';
import { client } from '..';

export const addRep = async (
    userId: string,
    interaction: CommandInteraction
) => {
    try {
        const reputation = await client.prisma.reputation.findUnique({
            where: {
                userId,
            },
        });
        if (!reputation) {
            await client.prisma.reputation.create({
                data: {
                    count: 0,
                    userId: userId,
                },
            });
        }
        await client.prisma.reputation.update({
            where: {
                userId,
            },
            data: {
                count: {
                    increment: 1,
                },
            },
        });
    } catch (err) {
        interaction.reply({
            content: 'An enexpected error occured!',
            ephemeral: true,
        });
    }
};
