import 'dotenv/config';

import { Cheeka } from './lib/classes/Cheeka';

export const client: Cheeka = new Cheeka();

export const rawVariable = "workflow test";

client.deploy();
