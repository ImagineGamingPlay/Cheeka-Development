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

export const config: ConfigType = {
  environment: ENV,
  token: ENV?.toLowerCase() == 'prod' ? PROD_TOKEN : DEV_TOKEN,
  clientId: ENV?.toLowerCase() == 'prod' ? PROD_CLIENT_ID : DEV_CLIENT_ID,
  devGuildId: DEV_GUILD_ID,
  mainGuildId: MAIN_GUILD_ID,

  colors: {
    blurple: 0x5865f2,
    red: 0xed4245,
    green: 0x57f287,
    white: 0xffffff,
  },
};
