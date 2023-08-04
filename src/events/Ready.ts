import { client } from '..';
import { updateRepLeaderboard } from '../features';
import { Event } from '../lib/classes/Event';
import { logger } from 'console-wizard';

export default new Event('ready', async () => {
    logger.success(`Logged into Client: ${client.user?.username}`);
    await updateRepLeaderboard();
});
