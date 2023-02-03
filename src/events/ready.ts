import { Event } from "../lib/classes/Event";
import { logger } from "./../utils/Logger";

export default new Event("ready", async () => {
  logger.info("Login Successful!");
});
