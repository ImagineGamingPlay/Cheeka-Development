import { client } from '..';
//import { updateRepLeaderboard } from '../features';
import { Event } from '../lib/classes/Event';
import { logger } from 'console-wizard';
//import { cacheTriggerPatterns } from '../lib/functions/cacheData';

export default new Event('ready', async () => {
    logger.success(`Logged into Client: ${client.user?.username}`);
    //await updateRepLeaderboard();
    //await cacheTriggerPatterns();
});
