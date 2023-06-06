import { CommandType } from '../../types';
import { logger } from '../../utils';
import { client } from '../..';
import { readdirSync } from 'fs';
import { join } from 'path';
// import axios from 'axios';

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
    console.log(command);
    commands.push(command);
    client.commands.set(command.name, command);

    const baseAPIUrl = 'https://discord.com/api/v9';
    if (client.config.environment == 'dev') {
      await fetch(
        `${baseAPIUrl}/applications/${client.user?.id}/${client.config.devGuildId}/commands`,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(commands[0]),
        }
      );

      logger.success(`Registered Guild Application (/) Command: ${command.name}`);
      return;
    }
    if (client.config.environment == 'prod') {
      await fetch(`${baseAPIUrl}/applications/${client.user?.id}/commands`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commands[0]),
      });
      logger.success(`Registered Global Application (/) Command: ${command.name}`);
      return;
    }
  });
};
