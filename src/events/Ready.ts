import { client } from '..';
import { Event } from '../lib/classes/Event';
import { registerButtons } from '../lib/functions/registerButtons';
import { registerCommands } from '../lib/functions/registerCommands';
import { logger } from 'console-wizard';

export default new Event('ready', async () => {
    logger.success(`Logged into Client: ${client.user?.username}`);
    await registerCommands();
    await registerButtons();
});
