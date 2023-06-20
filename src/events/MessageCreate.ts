import { promoTimeout, announcementsReaction } from '../features';
import { Event } from '../lib';
import { config } from '../config';
import { categories } from '../data';
import { TextChannel } from 'discord.js';
export default new Event('messageCreate', async message => {
  if (message.author.bot) {
    return;
  }

  const channel = message.channel as TextChannel;
  if (channel.parentId === categories.promotionCategoryId) {
    await promoTimeout(message);
  }
  if (config.aiReactionChannels && config.openaiApiKey && config.aiReactionChannels.includes(message.channel.id)) announcementsReaction(message);
});
