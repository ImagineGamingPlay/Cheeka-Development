/* Imports */
import { ConfigType } from './types';
import 'dotenv/config';
export const config: ConfigType = {
    environment: process.env.NODE_ENV, // 'prod' | 'dev'
    openaiApiKey: process.env.OPENAI_API_KEY,

    aiReactionChannels: ['channelId', 'channelId', '...'],

    token:
        process.env.NODE_ENV.toLowerCase() === 'prod'
            ? process.env.PROD_BOT_TOKEN
            : process.env.DEV_BOT_TOKEN,
    clientId: 'bot client Id (user Id)',
    guildId: "bot's guild id",
    ownerId: "bot and guiid's owner's id",
    staffRoleId: 'Role ID of staff role',
    modMailCategoryId: '',
    modMailLogsId: '',
    modMailDiscussionId: '',
    repCooldownMS: 0, // Rep add cooldown in miliseconds
    devGuildId: 'development guild Id',
    mainGuildId: 'main/production guild Id',
    repLeaderboardColors: ['colors', 'for', 'rep', 'leaderboard', '5 of em'],

    developerRoleId: 'ID of the developer role',

    colors: {
        blurple: 0, // Blurple color code as int
        red: 0, // red color code as int
        green: 0, // green color code as int
        white: 0, // white color code as int
    },
};
