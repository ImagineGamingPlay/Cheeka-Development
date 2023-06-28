import { client } from '../..';

export const modifyTag = async (name: string, newContent: string) => {
    await client.prisma.tag.update({
        where: {
            name,
        },
        data: {
            content: newContent,
            newContent: null,
        },
    });
};
