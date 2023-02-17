import { Client, ClientOptions } from 'eris';
import { handleEvents } from '..';
import { config } from '../../config';
import { promoTimeout } from '../../features';
import { CommandType } from '../../types';
import { logger } from '../../utils';
import { ConfigType } from './../../types/configType';

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
    promoTimeout();

    logger.success(`Client deployed!`);
    logger.info(`Environment: ${this.config.environment}`);
  }
}
