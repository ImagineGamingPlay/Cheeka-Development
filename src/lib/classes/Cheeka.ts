import { ActivityPartial, BotActivityType, Client, ClientOptions } from 'eris';
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

const setActivityStatus = (client: Cheeka) => {
  const activities: ActivityPartial<BotActivityType>[] = [
    {
      name: "Minecraft on IGP's MC Server!",
      type: 0,
    },
    {
      name: "your queries on IGP's server!",
      type: 2,
    },
    {
      name: "IGP's video on YouTube!",
      type: 3,
    },
  ];
  const { floor, random } = Math;
  const randomActivityIndex = floor(random() * (activities.length + 1));
  client.editStatus('online', activities[randomActivityIndex]);
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
    setActivityStatus(this);
    logger.success(`Client deployed!`);
    logger.info(`Environment: ${this.config.environment}`);
  }
}
