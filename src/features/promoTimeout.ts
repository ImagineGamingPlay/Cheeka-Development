import { client } from '..';
import { promoBlacklist } from '../types';
import { messages } from '../data';
import { EmbedBuilder } from '@discordjs/builders';
import { Message } from 'discord.js';

let blacklist: promoBlacklist[] = [];

export const promoTimeout = async (message: Message) => {

    let limit = 10;

    if (message.member?.premiumSince) {
        limit = 5;
    }

    const alreadyBlacklist = blacklist.some(
        (obj: promoBlacklist) => obj.id === message.author.id
    );

    if (alreadyBlacklist) {
        await message.delete();
        const guild = client.guilds.cache.get(message?.guildId || '');
        const embed = new EmbedBuilder({
            title: messages.promoBlacklistFail.title,
            description: messages.promoBlacklistFail.description,
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

    blacklist.forEach(obj => {
        obj.index--;
    });

    blacklist = blacklist.filter(obj => obj.index !== 0);
    blacklist.push({ id: message.author.id, index: limit });
};

