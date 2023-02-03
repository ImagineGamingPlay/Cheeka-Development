import { ConfigType, EnvironmentType } from "./types";

const ENV: "dev" | "prod" = process.env.NODE_ENV as EnvironmentType;
const PROD_TOKEN = process.env.PROD_BOT_TOKEN as string;
const DEV_TOKEN = process.env.DEV_BOT_TOKEN as string;
const PROD_CLIENT_ID = process.env.PROD_CLIENT_ID as string;
const DEV_CLIENT_ID = process.env.DEV_CLIENT_ID as string;

export const config: ConfigType = {
  token: ENV?.toLowerCase() == "prod" ? PROD_TOKEN : DEV_TOKEN,
  clientId: ENV?.toLowerCase() == "prod" ? PROD_CLIENT_ID : DEV_CLIENT_ID,
};
