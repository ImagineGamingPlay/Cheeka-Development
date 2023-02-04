import 'dotenv/config';
import { Cheeka } from './lib/classes/Cheeka';

export const client = new Cheeka();

client.deploy();
