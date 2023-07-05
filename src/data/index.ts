import * as prodIdData from './idData.prod';
import * as devIdData from './idData.dev';

const env = process.env.NODE_ENV;
let ids;

if (env === 'dev') {
    ids = devIdData;
} else {
    ids = prodIdData;
}

export const idData = ids;

export * from './messages';
export * from './cooldown';
