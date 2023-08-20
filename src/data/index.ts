import * as prodIdData from './idData.prod';
import * as devIdData from './idData.dev';

const env = process.env.NODE_ENV;

export const idData = env === 'dev' ? devIdData : prodIdData;

export * from './messages';
export * from './cooldown';
