import 'dotenv/config';
import { Cheeka } from './lib';
import { logger, setWizardConfig } from 'console-wizard';

setWizardConfig({
    includeStatus: true,
    includeTimestamp: true,
});

export const client: Cheeka = new Cheeka();

client.deploy();

process.on('uncaughtException', error => {
    logger.error(error.name);
    console.log(
        `${error.message}\nCause: ${error.cause}\nStack: ${error.stack}`
    );
});
process.on('unhandledRejection', (error, promise) => {
    logger.error(`Unhandled Promise: ${promise}`);
    console.log(error);
});
