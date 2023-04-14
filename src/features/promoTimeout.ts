import { client } from '..';
import { promoBlacklist } from '../types';
import { messages, categories } from '../data';
import { EmbedBuilder } from '@discordjs/builders';
import { Message, TextChannel } from 'discord.js';

let blacklist: promoBlacklist[] = [];

export const promoTimeout = async (message: Message, limit: number) => {
  const channel = message.channel as TextChannel;
  if (channel.parentId !== categories.promotionCategoryId) return;
  console.log('checkpoint 1');

  const alreadyBlacklist = blacklist.some(
    (obj: promoBlacklist) => obj.id === message.author.id
  );

  console.log('checkpoint 2');
  console.log(alreadyBlacklist);
  if (alreadyBlacklist) {
    console.log('checkpoint infinity');
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

  console.log('checkpoint 3');
  blacklist.forEach(obj => {
    obj.index--;
  });

  console.log('checkpoint 4');

  blacklist.forEach(obj => console.log(`Before: ${obj}`));

  blacklist = blacklist.filter(obj => obj.index !== 0);
  blacklist.push({ id: message.author.id, index: 1 });

  console.log('checkpoint 5');

  blacklist.forEach(obj => console.log(`After: ${obj}`));
};
