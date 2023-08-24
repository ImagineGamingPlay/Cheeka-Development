import { prisma } from '../..';
import { triggerPatternCache } from '../../utils/Cache';

export const cacheTriggerPatterns = async () => {
    const triggers = await prisma.trigger.findMany();
    triggers.forEach(trigger => {
        const regexMatch = trigger.regexMatch.map(regex => {
            const pattern = regex.slice(1, regex.lastIndexOf('/'));
            const flags = regex.slice(regex.lastIndexOf('/') + 1);
            return new RegExp(pattern, flags);
        });
        triggerPatternCache.set(trigger.type, {
            stringMatch: trigger.stringMatch,
            replyMessageContent: trigger.replyMessageContent,
            regexMatch,
        });
    });
};
