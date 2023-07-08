import { client } from '../..';
import { CommandData, LoadedApplicationCommands } from '../../types';
import { logger } from 'console-wizard';
import { getFiles } from '../../utils';
import { ApplicationCommandType } from 'discord.js';

export const registerApplicationCommands = async () => {
    const commands: CommandData[] = [];
    const commandFiles = getFiles(`${__dirname}/../../commands`, true);

    const loadedCommandNames: LoadedApplicationCommands[] = [];

    for (const file of commandFiles) {
        const commandClass: CommandData = await (await import(file)).default;
        const { ...command } = commandClass;

        if (!command.name) {
            logger.error('One of the command is lacking name!');
            return;
        }

        if (!command.type) return;

        if (command.type === ApplicationCommandType.ChatInput) {
            client.commands.set(command.name, command);
        }
        if (command.type === ApplicationCommandType.User) {
            client.userContextMenus.set(command.name, command);
        }
        if (command.type === ApplicationCommandType.Message) {
            client.messageContextMenus.set(command.name, command);
        }

        commands.push(command);
        loadedCommandNames.push({ LoadedCommands: command.name });
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
            'Command Type: Global [Discord takes upto an hour to update the commands]'
        );
        return;
    }
};
