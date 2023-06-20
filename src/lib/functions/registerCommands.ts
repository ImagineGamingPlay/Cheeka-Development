import { readdirSync } from 'fs';
import { join } from 'path';
import { client } from '../..';
import { CommandTableObjectsType, CommandType } from '../../types';
import { logger } from '../../utils';

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

export const registerCommands = async () => {
    const commands: CommandType[] = [];
    const commandFiles = getCommandFiles(`${__dirname}/../../commands`, true);

    const loadedCommandNames: CommandTableObjectsType[] = [];

    for (const file of commandFiles) {
        const commandClass: CommandType = await (await import(file)).default;
        const { ...command } = commandClass;

        if (!command.name) {
            logger.error('One of the command is lacking name!');
            return;
        }
        commands.push(command);
        loadedCommandNames.push({ LoadedCommands: command.name });
        client.commands.set(command.name, command);
    }
    // console.log(commands);
    if (client.config.environment === 'dev') {
        const devGuild = client.guilds.cache.get(client.config.devGuildId);
        // client.application?.commands.set([], devGuild?.id || '');
        await devGuild?.commands.set(commands);

        console.table(loadedCommandNames);
        logger.info('Command Type: Guild');
        return;
    }
    if (client.config.environment === 'prod') {
        await client.application?.commands.set(commands);

        console.table(loadedCommandNames);
        logger.info(
            'Command Type: Global [Discord takes upto an hour to upate the commands]'
        );
        return;
    }
};
