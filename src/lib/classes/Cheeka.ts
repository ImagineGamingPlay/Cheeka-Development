import { Client, ClientOptions } from "eris";
import { config } from "../../config";

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
  constructor() {
    super(`Bot ${config.token}`, clientOptions);
  }

  init() {
    if (!this.bot) {
      console.error("The provided client is NOT registered as a Discord Bot!");
      return;
    }
  }
}
