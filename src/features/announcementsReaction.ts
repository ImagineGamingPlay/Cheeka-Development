import { EmojiIdentifierResolvable, Message } from 'discord.js';
import { config } from '../config';
import { Configuration, OpenAIApi } from 'openai';

export const announcementsReaction = (
    message: Message,
    timesCalled?: number
) => {
    if (!timesCalled) timesCalled = 0;
    if (timesCalled > (config.aiReactionTimesCalled || 5)) return;
    timesCalled++;
    const openai = new OpenAIApi(
        new Configuration({ apiKey: config.openaiApiKey })
    );
    openai
        .createCompletion({
            model: 'text-davinci-003',
            prompt: `
        React to the messages with emojis only. Use a JSON array of strings to include the emojis. The array can have 3 or 4 emojis. If you can only think of 1 or 2 relevant emojis, that's fine too. Don't add irrelevant emojis just to meet the desired length. However, don't exceed more than 3 or 4 emojis. Keep the most relevant emojis at the beginning of the array. Only provide the array as your response, no other text.

        Text: ${message.content}

        Assistant:
        `,
            max_tokens: 50,
            temperature: 0.9,
        })
        .then(async resp => {
            let r = resp.data.choices[0].text as string;
            r = r.replace("'", '"');
            try {
                const regexpMatch = r.match(/\[.*?\]/);
                if (!regexpMatch) return;

                JSON.parse(regexpMatch[0]).forEach(
                    (e: EmojiIdentifierResolvable) =>
                        message
                            .react(e)
                            .catch(() =>
                                announcementsReaction(message, timesCalled)
                            )
                );
            } catch {
                announcementsReaction(message, timesCalled);
            }
        })
        .catch(() => announcementsReaction(message, timesCalled));
};
