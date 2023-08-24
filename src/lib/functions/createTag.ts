import { prisma } from '../..';
import { TagProps } from '../../types';

export const createTag = async ({
    name,
    content,
    type,
    ownerId,
}: Omit<TagProps, 'interaction'>) => {
    await prisma.tag.create({
        data: {
            name,
            content,
            type,
            ownerId,
            // owner: {
            //     connectOrCreate: {
            //         where: {
            //             userId: ownerId,
            //         },
            //         create: {
            //             userId: ownerId,
            //         },
            //     },
            // },
        },
    });
};
