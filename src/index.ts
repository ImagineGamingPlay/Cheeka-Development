import "dotenv/config";
import { Cheeka } from "./lib/classes/Cheeka";

const client = new Cheeka();

client.deploy();
