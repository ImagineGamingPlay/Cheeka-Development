import { Client, ClientOptions, EventListeners } from "eris";
import { glob } from "glob";
import { promisify } from "util";
import { config } from "../../config";
import { logger } from "../../utils";
import { ConfigType } from "./../../types/configType";
import { Event } from "./Event";

const globPromise = promisify(glob);

const clientOptions: ClientOptions = {
  intents: ["guilds", "guildMessages", "directMessages", "guildMembers"],
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
      logger.error("The provided client is NOT registered as a Discord Bot!");
      return;
    }
    await this.connect().catch((err) => logger.error(err));
    await this.handleEvents();

    logger.success(`Client deployed!`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
  }
  async importFile(filePath: string) {
    return (await import(filePath))?.default;
  }

  async handleEvents() {
    const events = await globPromise(`${__dirname}/../../events/*{.ts,.js}`);
    events.forEach(async (eventFilePath) => {
      logger.info(eventFilePath);
      const eventObj: Event<keyof EventListeners> = await this.importFile(
        eventFilePath,
      );

      this.on(eventObj.event, eventObj.run);
    });
  }
}
