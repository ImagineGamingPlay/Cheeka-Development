import { client } from '..';
import { updateRepLeaderboard } from '../features';
import { Event } from '../lib/classes/Event';
import { logger } from 'console-wizard';
import { cacheTriggerPatterns } from '../lib/functions/cacheData';
import { generateCodeImage } from '../interactions/buttons/tagAccept';
import { idData } from '../data';
import { AttachmentBuilder, TextChannel } from 'discord.js';

export default new Event('ready', async () => {
    logger.success(`Logged into Client: ${client.user?.username}`);
    await updateRepLeaderboard();
    await cacheTriggerPatterns();

    const attachment = new AttachmentBuilder(
        await generateCodeImage('a', 'abcdefghijklmnopqrstuvwxyzabcdef'),
        { name: 'a.png' }
    );
    const channel = client.channels.cache.get(
        idData.channels.memberCodesChannel
    ) as TextChannel;

    await channel.send({
        files: [attachment],
    });
});
