import {
  ClientOptions,
  GatewayIntentBits,
  Client,
  ActivitiesOptions,
  ActivityType,
  PresenceUpdateStatus,
  Collection,
} from 'discord.js';
import { databaseConnect, handleEvents } from '..';
import { config } from '../../config';
import { CommandType } from '../../types';
import { logger } from '../../utils';
import { ConfigType } from './../../types/configType';

const { Guilds, GuildMessages, DirectMessages, GuildMembers } = GatewayIntentBits;
const clientOptions: ClientOptions = {
  intents: [Guilds, GuildMessages, DirectMessages, GuildMembers],
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

  constructor() {
    super(clientOptions);

    this.config = config;
    this.commands = new Collection();
  }

  async deploy() {
    await this.login(config.token);
    await handleEvents();
    await databaseConnect();
    setActivityStatus(this);
    logger.success('Client Deployed!');
    logger.info(`Environment: ${this.config.environment}`);
  }
}
