/* Imports */
import { ConfigType } from './types';

export const config: ConfigType = {
    environment: '', // 'prod' | 'dev'
    openaiApiKey: 'openai_api_key',

    aiReactionChannels: ['channelId', 'channelId', '...'],

    token: 'Bot token',
    clientId: 'bot client Id (user Id)',
    guildId: "bot's guild id",

    devGuildId: 'development guild Id',
    mainGuildId: 'main/production guild Id',

    developerRoleId: 'ID of the developer role',

    colors: {
        blurple: 0, // Blurple color code as int
        red: 0, // red color code as int
        green: 0, // green color code as int
        white: 0, // white color code as int
    },
};
