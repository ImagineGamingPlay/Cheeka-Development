const ENV = process.env.NODE_ENV;
const PROD_TOKEN = process.env.PROD_BOT_TOKEN;
const DEV_TOKEN = process.env.DEV_BOT_TOKEN;
const PROD_CLIENT_ID = process.env.PROD_CLIENT_ID;
const DEV_CLIENT_ID = process.env.DEV_CLIENT_ID;

export interface ConfigType {
  token: string;
  clientId: string;
}

export const config: ConfigType = {
  token: ENV?.toLowerCase() == "prod" ? PROD_TOKEN : DEV_TOKEN,
  clientId: ENV?.toLowerCase() == "prod" ? PROD_CLIENT_ID : DEV_CLIENT_ID,
};
