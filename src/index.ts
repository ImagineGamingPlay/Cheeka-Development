import 'dotenv/config';
import { Cheeka } from './lib/classes/Cheeka';

export const client: Cheeka = new Cheeka();

client.deploy();
