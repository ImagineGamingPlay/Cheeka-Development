import { readdirSync } from 'fs';
import { join } from 'path';

/* Utility Functions */
const getCommandFiles = (path: string, categorized: boolean): string[] => {
  const files: string[] = [];

  // FS = FileSystem (FSNode representing both files and folders)
  const firstDepthFSNodes = readdirSync(path);

  firstDepthFSNodes.forEach(FSNode => {
    if (!categorized) {
      files.push(join(path, FSNode));
      return files;
    }

    // Basically files but named this way for consistency
    const secondDepthFSNodes = readdirSync(`${path}/${FSNode}`).filter(f =>
      f.endsWith('.ts')
    );

    secondDepthFSNodes.forEach(fileName => {
      files.push(join(path, FSNode, fileName));
      return files;
    });
  });
  return files;
};

import { client } from '../..';
import { CommandType } from '../../types';
import { logger } from '../../utils';

export const registerCommands = async () => {
  const commands: CommandType[] = [];
  const commandFiles = getCommandFiles(`${__dirname}/../../commands`, true);

  for (const file of commandFiles) {
    const commandClass: CommandType = await (await import(file)).default;
    const { ...command } = commandClass;

    if (!command.name) {
      logger.error('One of the command is lacking name!');
      return;
    }
    commands.push(command);
    client.commands.set(command.name, command);
  }
  // console.log(commands);
  if (client.config.environment == 'dev') {
    const devGuild = client.guilds.cache.get(client.config.devGuildId);
    // client.application?.commands.set([], devGuild?.id || '');
    await devGuild?.commands.set(commands);
    logger.success(`Registered ${commands.length} Guild Application (/) Commands`);
    return;
  }
  if (client.config.environment == 'prod') {
    await client.application?.commands.set(commands);
    logger.success(`Registered ${commands.length} Global Application (/) Commands`);
    logger.info('Discord takes upto an hour to upate the commands.');
    return;
  }
};
