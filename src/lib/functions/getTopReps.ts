import { prisma } from '../..';

export const getTopReps = async (index: number) => {
    const reputations = await prisma.reputation.findMany();
    const topReps = reputations.sort((a, b) => b.count - a.count);
    return topReps.slice(0, index);
};
