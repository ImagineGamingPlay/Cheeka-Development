import { client } from '../..';
import { CommandTableObjectsType, CommandType } from '../../types';
import { logger } from 'console-wizard';
import { getFiles } from '../../utils';

/* Utility Functions */
export const registerCommands = async () => {
    const commands: CommandType[] = [];
    const commandFiles = getFiles(`${__dirname}/../../commands`, true);

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
