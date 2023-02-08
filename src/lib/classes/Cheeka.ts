import { Client, ClientOptions, Collection } from 'eris';
import { glob } from 'glob';
import { promisify } from 'util';
import { handleEvents } from '..';
import { config } from '../../config';
import { CommandType } from '../../types';
import { logger } from '../../utils';
import { registerCommands } from '../functions/registerCommands';
import { ConfigType } from './../../types/configType';
import { Command } from './Command';

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
  commands: Map<string, CommandType>;

  constructor() {
    super(`Bot ${config.token}`, clientOptions);

    this.config = config;
    this.commands = new Map();
  }

  async deploy() {
    if (!this.bot) {
      logger.error('The provided client is NOT registered as a Discord Bot!');
      return;
    }
    await this.connect().catch(err => logger.error(err));
    await handleEvents();
    // await registerCommands();

    logger.success(`Client deployed!`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  }
}
