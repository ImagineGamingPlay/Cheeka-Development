import { CommandType } from '../../types';
import { logger } from '../../utils';
import { client } from '../..';
import { readdirSync } from 'fs';
import { join } from 'path';

/* Utility Functions */
const getCommandFiles = (path: string, categorized: boolean): string[] => {
  const files: string[] = [];
  const firstDepthFSNodes = readdirSync(path); // FS = FileSystem (FSNode representing both files and folders)

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

export const registerCommands = async () => {
  const commands: CommandType[] = [];
  const commandFiles = getCommandFiles(`${__dirname}/../../commands`, true);

  commandFiles.forEach(async file => {
    const importFilePath = file;
    const command: CommandType = await (await import(importFilePath)).default;

    if (!command.name) {
      logger.error('One of the command is lacking name!');
      return;
    }
    commands.push(command);
    client.commands.set(command.name, command);
  });

  if (client.config.environment == 'dev') {
    const devGuild = client.guilds.cache.get(client.config.devGuildId);
    await devGuild?.commands
      .set(commands)
      .then(() => {
        commands.forEach(command =>
          logger.success(
            `Registered Guild (${devGuild?.name}) Command: ${command.name}`
          )
        );
      })
      .catch(err => logger.error(err));
  }

  if (client.config.environment == 'prod') {
    await client.application?.commands
      .set(commands)
      .then(() =>
        commands.forEach(command =>
          logger.success(`Registered Application (/) Command: ${command.name}`)
        )
      )
      .catch(err => logger.error(err));
  }
};
