import 'dotenv/config';
import { Cheeka } from './lib';

export const client: Cheeka = new Cheeka();

client.deploy();
