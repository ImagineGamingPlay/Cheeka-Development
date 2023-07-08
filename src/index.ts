import 'dotenv/config';
import { Cheeka } from './lib';
import { setWizardConfig } from 'console-wizard';

setWizardConfig({
    includeStatus: true,
    includeTimestamp: true,
});

export const client: Cheeka = new Cheeka();

// client.on('debug', console.log).on('warn', console.log);
// client.once('ready', () => console.log('Ready - from index.ts'));

client.deploy();
