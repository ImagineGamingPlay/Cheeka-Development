/*
 * This file declares a global namespace for the 'ProcessEnv' interface
 * which consists of all the key value pairs available in .env file
 */

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'dev' | 'prod';

            DEV_BOT_TOKEN: string;
            PROD_BOT_TOKEN: string;

            DEV_CLIENT_ID: string;
            PROD_CLIENT_ID: string;

            DEV_GUILD_ID: string;
            MAIN_GUILD_ID: string;

            DATABASE_URL: string;
        }
    }
}

export {};
