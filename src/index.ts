import 'dotenv/config';
import { Cheeka } from './lib';
import { setWizardConfig } from 'console-wizard';

setWizardConfig({
    includeStatus: true,
    includeTimestamp: true,
});

export const client: Cheeka = new Cheeka();

client.deploy();
