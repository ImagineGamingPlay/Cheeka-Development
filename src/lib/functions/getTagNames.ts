import { prisma } from '../..';
import { TagType } from '.prisma/client';

export const getTagNames = async (type: TagType) => {
    const tags = await prisma.tag.findMany({
        where: {
            type,
        },
    });

    return tags.map(tag => tag.name);
};
