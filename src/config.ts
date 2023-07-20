/*
 *
 * This is the main configuration file for Cheeka.
 * Please modify only if required.
 * Removing/Changing values WILL result in errors
 */

/* Imports */
import { ConfigType } from './types';
import { raise } from './utils/raise';

const NODE_ENV = process.env.NODE_ENV ?? raise('Missing "NODE_ENV"');

const PROD_BOT_TOKEN =
    process.env.PROD_BOT_TOKEN ?? raise('Missing "PROD_BOT_TOKEN"');
const DEV_BOT_TOKEN =
    process.env.DEV_BOT_TOKEN ?? raise('Missing "DEV_BOT_TOKEN"');
const PROD_CLIENT_ID =
    process.env.PROD_CLIENT_ID ?? raise('Missing "PROD_CLIENT_ID"');
const DEV_CLIENT_ID =
    process.env.DEV_CLIENT_ID ?? raise('Missing "DEV_CLIENT_ID"');
const OPENAI_API_KEY =
    process.env.OPENAI_API_KEY ?? raise('Missing "OPENAI_API_KEY"');
const DEV_GUILD_ID =
    process.env.DEV_GUILD_ID ?? raise('Missing "DEV_GUILD_ID"');
const MAIN_GUILD_ID =
    process.env.MAIN_GUILD_ID ?? raise('Missing "MAIN_GUILD_ID"');

const AI_REACTION_CHANNELS = ['1110551425555124324', '1126471827628228648'];

const mainGuildDevRole = '957257138680516648';
const devGuildDevRole = '955405899877458021';

export const config: ConfigType = {
    environment: NODE_ENV,
    openaiApiKey: OPENAI_API_KEY,

    aiReactionChannels: AI_REACTION_CHANNELS,

    token: NODE_ENV?.toLowerCase() === 'prod' ? PROD_BOT_TOKEN : DEV_BOT_TOKEN,
    clientId:
        NODE_ENV?.toLowerCase() === 'prod' ? PROD_CLIENT_ID : DEV_CLIENT_ID,
    guildId: NODE_ENV.toLowerCase() === 'prod' ? MAIN_GUILD_ID : DEV_GUILD_ID,

    devGuildId: DEV_GUILD_ID,
    mainGuildId: MAIN_GUILD_ID,

    developerRoleId:
        NODE_ENV.toLowerCase() === 'prod' ? mainGuildDevRole : devGuildDevRole,

    colors: {
        blurple: 0x5865f2,
        red: 0xed4245,
        green: 0x57f287,
        white: 0xffffff,
    },
};
