import { client } from '..';
import { promoBlacklist } from '../types';

export const promoTimeout = () => {
  const promoChannelId = '1074881123794046991';
  let blacklist: promoBlacklist[] = [];

  client.on('messageCreate', async message => {
    if (message.author.bot) {
      return;
    }

    if (message.channel.id == promoChannelId) {
      const alreadyBlacklist = blacklist.some(
        (obj: promoBlacklist) => obj.id === message.author.id
      );
      if (alreadyBlacklist) {
        // client.createMessage(message.channel.id, {
        //   content: 'You are currently blacklisted!',
        // });
        await message.delete();
        return;
      }
      blacklist.forEach(obj => {
        obj.index--;
      });

      blacklist = blacklist.filter(obj => obj.index > 0);
      blacklist.push({ id: message.author.id, index: 1 });
    }
  });
};
