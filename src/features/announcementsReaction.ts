import { EmojiIdentifierResolvable, Message } from 'discord.js';
import { config } from "../config";
import { OpenAIApi, Configuration } from "openai";
export const announcementsReaction = (message: Message, timesCalled?: number) => {
    if(!timesCalled) timesCalled = 0;
    if(timesCalled > (config.aiReactionTimesCalled || 5)) return;
    timesCalled++;
    let openai = new OpenAIApi(new Configuration({apiKey: config.openaiApiKey}));
    openai.createCompletion({
        model: "text-davinci-003",
        prompt: `
        
        Text: ${message.content}

        Assistant:
        `,
        max_tokens: 50,
        temperature: 0.9
    }).then(async resp => {
        let r = resp.data.choices[0].text as string;
        r = r.replace("'", "\"");
        try {
            JSON.parse(r.match(/\[.*?\]/)![0]).forEach((e: EmojiIdentifierResolvable) => message.react(e).catch(() => announcementsReaction(message, timesCalled)));
        } catch {
            announcementsReaction(message, timesCalled);
        }
    }).catch(() => announcementsReaction(message, timesCalled));
};
