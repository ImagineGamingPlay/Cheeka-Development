import { promoTimeout, announcementsReaction } from '../features';
import { Event } from '../lib';
import { config } from "../config";
export default new Event('messageCreate', async message => {
  console.log(message.content);
  if (message.author.bot) {
    return;
  }
  await promoTimeout(message, 1).then(() => console.log('promoTimeout called'));
  if(config.aiReactionChannels.includes(message.channel.id)) announcementsReaction(message);
});
