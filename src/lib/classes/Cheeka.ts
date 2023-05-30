import {
  ClientOptions,
  GatewayIntentBits,
  Client,
  ActivitiesOptions,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} from 'discord.js';
import { handleEvents } from '..';
import { config } from '../../config';
import { CommandType } from '../../types';
import { logger } from '../../utils';
import { ConfigType } from './../../types/configType';
import { PrismaClient } from '@prisma/client';

const { Guilds, GuildMessages, DirectMessages, GuildMembers, MessageContent } = GatewayIntentBits;
const clientOptions: ClientOptions = {
  intents: [Guilds, GuildMessages, DirectMessages, GuildMembers, MessageContent],
  allowedMentions: {
    repliedUser: true,
  },
};

const setActivityStatus = (client: Cheeka) => {
  const activities: ActivitiesOptions[] = [
    {
      name: 'Minecraft on IGP\'s MC Server!',
      type: ActivityType.Playing,
    },
    {
      name: 'to your queries on IGP\'s server!',
      type: ActivityType.Listening,
    },
    {
      name: 'IGP\'s video on YouTube!',
      type: ActivityType.Watching,
    },
  ];
  const { floor, random } = Math;
  const randomActivityIndex = floor(random() * activities.length);
  client.user?.setPresence({
    activities: [activities[randomActivityIndex]],
    status: PresenceUpdateStatus.Online,
  });
};

export class Cheeka extends Client {
  config: ConfigType;
  commands: Collection<string, CommandType>;
  prisma: PrismaClient;

  constructor() {
    super(clientOptions);

    this.config = config;
    this.commands = new Collection();
    this.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async deploy() {
    await this.login(config.token);
    await handleEvents();
    setActivityStatus(this);
    logger.success('Client Deployed!');
    logger.info(`Environment: ${this.config.environment}`);
  }
}
