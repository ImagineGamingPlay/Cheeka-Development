import { promoTimeout, announcementsReaction } from '../features';
import { Event } from '../lib';
import { config } from "../config";
export default new Event('messageCreate', async message => {
  if (message.author.bot) {
    return;
  }
  await promoTimeout(message, 1);
  if(config.aiReactionChannels.includes(message.channel.id)) announcementsReaction(message);
});
