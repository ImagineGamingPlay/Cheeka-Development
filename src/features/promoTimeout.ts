import { EmbedBuilder, Message } from 'discord.js';
import { client } from '..';
import { promoBlacklist } from '../types';

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
      title: 'Hold up!',
      description: `You are on limit for promotion in **IGP's Coding Villa**. You can only send another promotion message after **${
        blacklist.find(item => item.id === message.author.id)?.index
      }** messages are sent after yours!`,
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
