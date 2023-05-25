import { connect, connection } from 'mongoose';
import { logger } from '../../utils';

export const databaseConnect = async () => {
  await connect(process.env.DB_URI as string);

  connection.on('connected', () => {
    logger.success('Connected to Database!');
  });

  connection.on('disconnected', () => {
    logger.warn('Disconnected from Database!');
  });
};
