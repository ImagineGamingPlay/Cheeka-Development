import { connect } from 'mongoose';
import { logger } from '../../utils';

export const databaseConnect = async () => {
  await connect(process.env.DB_URI as string).then(() => {
    logger.info('Connected to Database');
  });
};
