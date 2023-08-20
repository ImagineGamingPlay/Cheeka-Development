import 'dotenv/config';
import { Cheeka } from './lib';
import { logger, setWizardConfig } from 'console-wizard';
import { config } from './config';
import { PrismaClient } from '@prisma/client';

setWizardConfig({
    includeStatus: true,
    includeTimestamp: true,
});

export const client: Cheeka = new Cheeka();

export const prisma = new PrismaClient({
    log:
        config.environment === 'dev'
            ? ['query', 'info', 'warn', 'error']
            : ['warn', 'error'],
});

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
