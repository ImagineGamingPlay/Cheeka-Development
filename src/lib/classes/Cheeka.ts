import { Client, ClientOptions } from 'eris';
import { glob } from 'glob';
import { promisify } from 'util';
import { handleEvents } from '..';
import { config } from '../../config';
import { logger } from '../../utils';
import { ConfigType } from './../../types/configType';

const globPromise = promisify(glob);

const clientOptions: ClientOptions = {
  intents: ['guilds', 'guildMessages', 'directMessages', 'guildMembers'],
  allowedMentions: {
    everyone: false,
    roles: false,
    users: true,
    repliedUser: true,
  },
};

export class Cheeka extends Client {
  config: ConfigType;

  constructor() {
    super(`Bot ${config.token}`, clientOptions);

    this.config = config;
  }

  async deploy() {
    if (!this.bot) {
      logger.error('The provided client is NOT registered as a Discord Bot!');
      return;
    }
    await this.connect().catch(err => logger.error(err));
    await handleEvents();

    logger.success(`Client deployed!`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }
}
