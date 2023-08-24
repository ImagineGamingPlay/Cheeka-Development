import { prisma } from '../..';

export const modifyTag = async (name: string, newContent: string) => {
    await prisma.tag.update({
        where: {
            name,
        },
        data: {
            content: newContent,
            newContent: null,
        },
    });
};
