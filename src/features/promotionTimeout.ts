import { EmbedBuilder, Message } from 'discord.js';
import { client } from '..';

const { prisma } = client;

// let blacklist: PromotionBlacklist[] = [];

export const promotionTimeout = async (message: Message) => {
    let limit = 10;

    if (message.member?.premiumSince) {
        limit = 5;
    }

    const alreadyBlacklist = await prisma.promotionBlacklist.findFirst({
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
        const dmChannel = message.author.dmChannel;
        dmChannel?.send({ embeds: [embed] });

        return;
    }

    // Decrement the index of every blacklisted user
    await prisma.promotionBlacklist.updateMany({
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
    await prisma.promotionBlacklist.deleteMany({
        where: {
            index: 0,
        },
    });

    // blacklist = blacklist.filter(obj => obj.index !== 0);

    // Add the message author to blacklist
    await prisma.promotionBlacklist.create({
        data: {
            userId: message.author.id,
            index: limit,
        },
    });

    // blacklist.push({ id: message.author.id, index: limit });
};
