import { client } from '../..';
import { triggerPatternCache } from '../../utils/Cache';

export const cacheTriggerPatterns = async () => {
    const triggers = await client.prisma.trigger.findMany();
    triggers.forEach(trigger => {
        const regexMatch = trigger.regexMatch.map(regex => {
            const pattern = regex.slice(1, regex.lastIndexOf('/'));
            const flags = regex.slice(regex.lastIndexOf('/') + 1);
            return new RegExp(pattern, flags);
        });
        triggerPatternCache.set(trigger.name, {
            stringMatch: trigger.stringMatch,
            replyMessageContent: trigger.replyMessageContent,
            regexMatch,
        });
    });
};
