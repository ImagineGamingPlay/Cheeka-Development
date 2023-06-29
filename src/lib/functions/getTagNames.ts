import { client } from '../..';
import { TagType } from '.prisma/client';

export const getTagNames = async (type: TagType) => {
    const tags = await client.prisma.tag.findMany({
        where: {
            type,
        },
    });

    return tags.map(tag => tag.name);
};
