import { logger } from 'console-wizard';

export const raise = (err: string): never => {
    throw logger.error(err);
};
