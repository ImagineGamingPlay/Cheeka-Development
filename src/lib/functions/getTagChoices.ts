import { ApplicationCommandOptionChoiceData } from 'discord.js';
import { client } from '../..';
import { TagType } from '.prisma/client';

export const getTagChoices = async (type: TagType) => {
    const tags = await client.prisma.tag.findMany({
        where: {
            type,
        },
    });
    const tagChoices: ApplicationCommandOptionChoiceData<string>[] = tags.map(
        tag => {
            return {
                name: tag.name,
                value: tag.name,
            };
        }
    );
    return tagChoices;
};
