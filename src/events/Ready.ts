import { Event } from '../lib/classes/Event';
import { registerCommands } from '../lib/functions/registerCommands';
import { logger } from './../utils/Logger';

export default new Event('ready', async () => {
  logger.success('Login Successful!');
  registerCommands();
});
