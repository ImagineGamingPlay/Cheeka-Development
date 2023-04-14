import { CommandType } from '../../types';
import { promisify } from 'util';
import glob from 'glob';
import { logger } from '../../utils';
import { client } from '../..';

const globPromise = promisify(glob);

export const registerCommands = async () => {
  const commands: CommandType[] = [];
  const commandFiles = await globPromise(`${__dirname}/../../commands/*/*{.ts,.js}`);

  commandFiles.forEach(async (file, i) => {
    const command: CommandType = await (await import(file)).default;

    if (!command.name) {
      logger.error(`One of the command is lacking name! (Index: ${i})`);
      return;
    }

    commands.push(command);
    client.commands.set(command.name, command);

    if (client.config.environment == 'dev') {
      const devGuild = client.guilds.cache.get(client.config.devGuildId);
      await devGuild?.commands
        .set(commands)
        .then(() =>
          logger.success(`Registered Guild Application (/) Command: ${command.name}`)
        )
        .catch(err => logger.error(err));
    }
    if (client.config.environment == 'prod') {
      await client.application?.commands
        .set(commands)
        .then(() =>
          logger.success(`Registered Application (/) Command: ${command.name}`)
        )
        .catch(err => logger.error(err));
    }
  });
};
