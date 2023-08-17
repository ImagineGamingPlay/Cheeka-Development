import { Message } from 'discord.js';
import { triggerPatternCache } from '../utils/Cache';
const matchPattern = (content: string) => {
    for (const [, entry] of triggerPatternCache) {
        for (const str of entry.stringMatch) {
            if (content.includes(str)) {
                return entry.replyMessageContent;
            }
        }

        for (const regex of entry.regexMatch) {
            if (regex.test(content)) {
                return entry.replyMessageContent;
            }
        }
    }
    return undefined;
};

export const triggerSystem = async (message: Message) => {
    const replyMessageContent = matchPattern(message.content);
    console.log(triggerPatternCache);
    if (!replyMessageContent) return;

    await message.reply({
        content: replyMessageContent,
    });
};
