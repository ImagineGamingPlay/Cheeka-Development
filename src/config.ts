/*
 *
 * This is the main configuration file for Cheeka.
 * Please modify only if required.
 * Removing/Changing values WILL result in errors
 */

/* Imports */
import { ConfigType, EnvironmentType } from './types';

/* Variables */
const ENV = process.env.NODE_ENV as EnvironmentType;
const PROD_TOKEN = process.env.PROD_BOT_TOKEN as string;
const DEV_TOKEN = process.env.DEV_BOT_TOKEN as string;
const PROD_CLIENT_ID = process.env.PROD_CLIENT_ID as string;
const DEV_CLIENT_ID = process.env.DEV_CLIENT_ID as string;
const DEV_GUILD_ID = process.env.DEV_GUILD_ID as string;
const MAIN_GUILD_ID = process.env.MAIN_GUILD_ID as string;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const AI_REACTION_CHANNELS = ['1110551425555124324', '1126471827628228648'];
const AI_REACTION_TIMES_CALLED = process.env.AI_REACTION_TIMES_CALLED as string;

const BOOSTER_DM_COOLDOWN = process.env.BOOSTER_DM_COOLDOWN as string;
const mainGuildDevRole = '957257138680516648';
const devGuildDevRole = '955405899877458021';

export const config: ConfigType = {
    environment: ENV,
    openaiApiKey: OPENAI_API_KEY,

    boosterDMCooldown: parseInt(BOOSTER_DM_COOLDOWN),
    aiReactionChannels: AI_REACTION_CHANNELS,
    aiReactionTimesCalled: parseInt(AI_REACTION_TIMES_CALLED),

    token: ENV?.toLowerCase() === 'prod' ? PROD_TOKEN : DEV_TOKEN,
    clientId: ENV?.toLowerCase() === 'prod' ? PROD_CLIENT_ID : DEV_CLIENT_ID,
    guildId: ENV.toLowerCase() === 'prod' ? MAIN_GUILD_ID : DEV_GUILD_ID,

    devGuildId: DEV_GUILD_ID,
    mainGuildId: MAIN_GUILD_ID,

    developerRoleId:
        ENV.toLowerCase() === 'prod' ? mainGuildDevRole : devGuildDevRole,

    colors: {
        blurple: 0x5865f2,
        red: 0xed4245,
        green: 0x57f287,
        white: 0xffffff,
    },
};
