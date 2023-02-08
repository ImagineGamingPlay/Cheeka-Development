import { CommandType } from '../../types';
import { promisify } from 'util';
import glob from 'glob';
import { logger } from '../../utils';
import { client } from '../..';

const globPromise = promisify(glob);

export const registerCommands = async () => {
  const commands: CommandType[] = [];
  const commandFiles = await globPromise(`${__dirname}/../../commands/*/*{.ts,.js}`);

  commandFiles.forEach(async file => {
    const command: CommandType = await (await import(file)).default;

    if (!command.name) {
      logger.error('One of the command is lacking name!');
      return;
    }

    commands.push(command);
    client.commands.set(command.name, command);

    commands.forEach(async command => {
      await client
        .createCommand(command)
        .then(() =>
          logger.success(`Registered Application (/) Command: ${command.name}`)
        );
    });
  });
};
