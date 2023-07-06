import { EmbedBuilder, Message } from 'discord.js';
import { client } from '..';
import { Prisma } from '@prisma/client';

const { prisma } = client;

// let blacklist: PromotionBlacklist[] = [];

type PromotionBlacklist =
    | Prisma.PromotionBlacklist1Delegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >
    | Prisma.PromotionBlacklist2Delegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >
    | Prisma.PromotionBlacklist3Delegate<
          Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >;

let promotionBlacklist: PromotionBlacklist;

export const promotionTimeout = async (message: Message) => {
    if (message.channelId === '1076495008032628776')
        promotionBlacklist = prisma.promotionBlacklist1;

    if (message.channelId === '1076495035522109520')
        promotionBlacklist = prisma.promotionBlacklist2;

    if (message.channelId === '1076495056992731176')
        promotionBlacklist = prisma.promotionBlacklist3;

    let limit = 3;

    if (message.member?.premiumSince) {
        // if (message.member?.id === '453457425429692417') {
        limit = 1;
    }

    const alreadyBlacklist = await promotionBlacklist.findFirst({
        where: {
            userId: message.author.id,
        },
    });

    // const alreadyBlacklist = blacklist.some(
    //     (obj: PromotionBlacklist) => obj.id === message.author.id
    // );

    if (alreadyBlacklist) {
        await message.delete();
        const guild = client.guilds.cache.get(message?.guildId || '');

        const { index } = alreadyBlacklist;

        const embed = new EmbedBuilder({
            title: 'Hold up!',
            description: `You are on limit for promotion in **IGP's Coding Villa**. You can only send another promotion message after **${index}** messages are sent after yours!`,
            color: client.config.colors.red,
            author: {
                name: guild?.name || 'IGP',
                icon_url: guild?.iconURL() || '',
            },
        });

        await message?.author.send({ embeds: [embed] });

        return;
    }

    // Decrement the index of every blacklisted user
    await promotionBlacklist.updateMany({
        data: {
            index: {
                decrement: 1,
            },
        },
    });

    // blacklist.forEach(obj => {
    //     obj.index--;
    // });

    // Remove everyone with 0 index from blacklist
    await promotionBlacklist.deleteMany({
        where: {
            index: {
                lte: 0,
            },
        },
    });

    // blacklist = blacklist.filter(obj => obj.index !== 0);

    // Add the message author to blacklist
    await promotionBlacklist.create({
        data: {
            userId: message.author.id,
            index: limit,
        },
    });

    // blacklist.push({ id: message.author.id, index: limit });
};

// export const promotionTimeout = async (message: Message) => {
//     let limit = 3;
//
//     // if (message.member?.premiumSince) {
//     if (message.member?.id === '453457425429692417') {
//         limit = 1;
//     }
//
//     const alreadyBlacklist = await prisma.promotionBlacklist.findFirst({
//         where: {
//             userId: message.author.id,
//         },
//     });
//
//     // const alreadyBlacklist = blacklist.some(
//     //     (obj: PromotionBlacklist) => obj.id === message.author.id
//     // );
//
//     if (alreadyBlacklist) {
//         await message.delete();
//         const guild = client.guilds.cache.get(message?.guildId || '');
//
//         const { index } = alreadyBlacklist;
//
//         const embed = new EmbedBuilder({
//             title: 'Hold up!',
//             description: `You are on limit for promotion in **IGP's Coding Villa**. You can only send another promotion message after **${index}** messages are sent after yours!`,
//             color: client.config.colors.red,
//             author: {
//                 name: guild?.name || 'IGP',
//                 icon_url: guild?.iconURL() || '',
//             },
//         });
//
//         await message?.author.send({ embeds: [embed] });
//
//         return;
//     }
//
//     // Decrement the index of every blacklisted user
//     await prisma.promotionBlacklist.updateMany({
//         data: {
//             index: {
//                 decrement: 1,
//             },
//         },
//     });
//
//     // blacklist.forEach(obj => {
//     //     obj.index--;
//     // });
//
//     // Remove everyone with 0 index from blacklist
//     await prisma.promotionBlacklist.deleteMany({
//         where: {
//             index: {
//                 lte: 0,
//             },
//         },
//     });
//
//     // blacklist = blacklist.filter(obj => obj.index !== 0);
//
//     // Add the message author to blacklist
//     await prisma.promotionBlacklist.create({
//         data: {
//             userId: message.author.id,
//             index: limit,
//         },
//     });
//
//     // blacklist.push({ id: message.author.id, index: limit });
// };
