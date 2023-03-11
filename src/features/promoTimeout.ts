import { EmbedOptions, Message } from 'eris';
import { client } from '..';
import { promoBlacklist } from '../types';
import { messages } from '../data/messages';
import { categories } from '../data';

const timeoutChannel = async (
  message: Message,
  channelId: string,
  limit: number
) => {
  let blacklist: promoBlacklist[] = [];

  if (message.channel.id == channelId) {
    const alreadyBlacklist = blacklist.some(
      (obj: promoBlacklist) => obj.id === message.author.id
    );
    if (alreadyBlacklist) {
      await message.delete();
      const guild = client.guilds.get(message?.guildID || '');
      const embed: EmbedOptions = {
        title: messages.promoBlacklistFail.title,
        description: messages.promoBlacklistFail.description,
        color: client.config.colors.red,
        author: {
          name: guild?.name || 'IGP',
          icon_url: guild?.dynamicIconURL() || '',
        },
      };
      const dmChannel = await message.author.getDMChannel();
      dmChannel.createMessage({ embeds: [embed] });

      return;
    }
    blacklist.forEach(obj => {
      obj.index--;
    });

    blacklist = blacklist.filter(obj => obj.index > 0);
    blacklist.push({ id: message.author.id, index: limit });
  }
};

export const promoTimeout = () => {
  // const promoChannelId = '1074881123794046991';

  client.on('messageCreate', async message => {
    if (message.author.bot) {
      return;
    }
  });
};
