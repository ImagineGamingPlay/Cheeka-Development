import { announcementsReaction, promotionTimeout } from '../features';
import { Event } from '../lib';
import { config } from '../config';
import { idData } from '../data';
import { TextChannel } from 'discord.js';
import { boosterDM } from '../features';
import { triggerSystem } from '../features/triggerSystem';
import { modMail } from '../features';
export default new Event('messageCreate', async message => {
    if (message.author.bot) {
        return;
    }

    modMail(message);

    await triggerSystem(message);

    const channel = message.channel as TextChannel;
    if (channel.parentId === idData.categories.promotionCategoryId) {
        await promotionTimeout(message);
    }
    boosterDM(message);
    if (
        config.aiReactionChannels &&
        config.openaiApiKey &&
        config.aiReactionChannels.includes(message.channel.id)
    )
        announcementsReaction(message);
    boosterDM(message);
});
