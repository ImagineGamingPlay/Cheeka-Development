import { Message } from "discord.js";
import { config } from "../config";
import { cooldown } from "../data";
let startCooldown = (userId: string) => setTimeout(() => cooldown.delete(userId), config.boosterDMCooldown || 60000);
export const boosterDM = (message: Message) => {

    if([8, 9, 10, 11].includes(message.type)) {
        if(cooldown.has(message.author.id)) return;
        message.author.send("thanks for boosting");
        cooldown.add(message.author.id);
        startCooldown(message.author.id);
    }
};