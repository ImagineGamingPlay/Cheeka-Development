import { EmbedBuilder, Message } from 'discord.js';
import { cooldown } from '../data';

const BOOSTER_DM_COOLDOWN = 60 * 1000;

const startCooldown = (userId: string) =>
    setTimeout(() => cooldown.delete(userId), BOOSTER_DM_COOLDOWN || 60000);

export const boosterDM = async (message: Message) => {
    if ([8, 9, 10, 11].includes(message.type)) {
        if (cooldown.has(message.author.id)) return;

        const embed = new EmbedBuilder({
            title: 'Thank you for Boosting',
            description:
                'We wholeheartedly thank you for your kindness to the IGP community. And as a token of our gratitude, we would like to offer you some perks as well.\n\n**As long as you\'re boosted, you will:**\n <:igpboost:1120711992009818185> **Get access to the following channels:**\n  <#816976990233690122>: Chat with the other boosters here.\n  <#816709438693048350> & <#875073982569787422>: to enhance your bot development.\n <#875073982569787422>: Receive help faster here.\n  <#1015583996958224424>: Hop on the VC which everyone can see, but only boosters can join!\n  \n <:igpboost:1120711992009818185> **Be able to show off your new flashy role with a unique badge that makes you stand out from others.**\n\n** <:igpboost:1120711992009818185> Be able to promote more than others!**\nNormally, a member can only post their advertisement once in a promotion channel, and after that, they have to wait until a certain amount of promotion messages are posted (known as "the promotion messages limit").\nHowever, as a booster, the promotion messages limit for you will be lower so you can promote more often!\n[Click here to know more about the promotion messages limit](https://discord.com/channels/697495719816462436/936242386319863880/1015278382042325013)\n\n**New Perks Plan:**\nNothing planned as of now.\n\nYou can suggest new perks in the #boosters-perk-suggestion channel, we welcome new suggestions with our open arms.',
            thumbnail: {
                url: 'https://media.discordapp.net/attachments/743528061659643975/1120697032261247036/booster.png',
                height: 0,
                width: 0,
            },
            footer: {
                text: "This message won't be spammed, boost as many times as you wish.",
            },
            color: 10249133,
        });

        try {
            await message.author.send({ embeds: [embed] });
            cooldown.add(message.author.id);
            startCooldown(message.author.id);
        } catch {
            return;
        }
    }
};
