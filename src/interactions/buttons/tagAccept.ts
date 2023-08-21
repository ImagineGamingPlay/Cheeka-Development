import { AttachmentBuilder, ChannelType, EmbedBuilder } from 'discord.js';
import { client } from '../..';
import { Button } from '../../lib/classes/Button';
import { codeblockRegex, idData, sourcebinLanguageData } from '../../data';
import { Canvas, createCanvas, loadImage } from 'canvas';

export default new Button({
    scope: 'tagAccept',

    run: async ({ interaction, id }) => {
        const tag = await client.prisma.tag.findUnique({
            where: {
                id,
            },
        });

        if (!tag) {
            interaction.reply({
                content: "This tag doesn't exist!",
                ephemeral: true,
            });
            return;
        }

        await client.prisma.tag.update({
            where: {
                id,
            },
            data: {
                accepted: true,
            },
        });

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tag accepted!')
                    .setDescription(
                        `Tag \`${tag?.name}\` has been accepted by ${interaction.user}`
                    )
                    .setColor(client.config.colors.green),
            ],
        });

        const languageMatch = tag.content.match(codeblockRegex);
        const languageMatchStr = languageMatch?.at(2);
        if (!languageMatchStr) return;

        const content = languageMatch?.at(3);
        const languageId = getLanguageId(languageMatchStr) ?? 222;

        const formData = JSON.stringify({
            files: [
                {
                    name: tag.name,
                    content,
                    languageId,
                },
            ],
        });

        const headers = {
            'Content-Type': 'application/json',
        };
        const res = await fetch('https://sourceb.in/api/bins', {
            method: 'POST',
            body: formData,
            headers,
        });
        const tagOwner = interaction.guild?.members.cache.get(tag.ownerId);
        const contentUrl = await res.json();
        const image = await generateCodeImage(
            tag.name,
            tagOwner?.user.username ?? ''
        );

        const attachment = new AttachmentBuilder(image, {
            name: 'membercode-banner.png',
        });

        const channel = interaction.guild?.channels.cache.get(
            idData.channels.memberCodesChannel
        );
        if (channel?.type !== ChannelType.GuildText) return;
        console.log('checkiepointy');
        await channel.send({
            content: `## [${tag.name}](https://srcb.in/${contentUrl.key})\nBy ${tagOwner}`,
            files: [attachment],
        });

        const guild = client.guilds.cache.get(client.config.guildId);
        const owner = guild?.members.cache.get(tag?.ownerId ?? '');

        if (!owner) {
            await interaction.reply(
                `WARNING: Tag owner of ${tag?.name} not found!`
            );
            return;
        }

        try {
            await owner.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Your Tag was Accepted!')
                        .setDescription(
                            `Your request to create tag \`${tag?.name}\` was accepted! It is now available on the server`
                        )
                        .setAuthor({
                            name: `${guild?.name}`,
                            iconURL: `${guild?.iconURL()}`,
                        })
                        .setColor(client.config.colors.green),
                ],
            });
        } catch {
            return;
        }
    },
});

const getLanguageId = (matchStr: string) => {
    for (const key in sourcebinLanguageData) {
        const languageData =
            sourcebinLanguageData[key as keyof typeof sourcebinLanguageData];
        const matchStrArray: string[] = [languageData.name];
        if ('extension' in languageData)
            matchStrArray.push(languageData.extension);

        if (matchStrArray.includes(matchStr)) {
            return key;
        }
    }
    return;
};
const applyTextTitle = (canvas: Canvas, text: string) => {
    const context = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 35;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        context.font = `bold ${(fontSize -= 2)}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width - 100);

    // Return the result to use in the actual canvas
    return context.font;
};
const applyTextAuthor = (canvas: Canvas, text: string) => {
    const context = canvas.getContext('2d');

    // Declare a base size of the font
    let fontSize = 20;

    do {
        // Assign the font to the context and decrement it so it can be measured again
        context.font = `${(fontSize -= 2)}px sans-serif`;
        // Compare pixel width of the text to the canvas minus the approximate avatar size
    } while (context.measureText(text).width > canvas.width - 300);

    // Return the result to use in the actual canvas
    return context.font;
};
// const applyText = (
//     canvas: Canvas,
//     text: string,
//     fontSize: number,
//     styleText: string
// ) => {
//     const context = canvas.getContext('2d');
//
//     do {
//         context.font = styleText.replace('#', `${fontSize - 1}px`);
//     } while (context.measureText(text).width > canvas.width);
//
//     return context.font;
// };

export const generateCodeImage = async (codeName: string, author: string) => {
    const canvas = createCanvas(600, 316);
    const ctx = canvas.getContext('2d');

    const image = await loadImage(
        `${__dirname}/../../../assets/membercode-bg-small.png`
    );

    ctx.drawImage(image, 0, 0);

    ctx.font = applyTextTitle(canvas, codeName);
    // ctx.font = 'bold 30px Sans serif';
    ctx.fillStyle = '#d75c5c';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const titleX = canvas.width / 2;
    const titleY = canvas.height / 2;

    ctx.fillText(codeName, titleX, titleY);

    // Author
    const titleTextWidth = ctx.measureText(codeName).width;
    const titleTextHeight = ctx.measureText(codeName).actualBoundingBoxAscent;

    const authorText = `By ${author}`;
    ctx.font = applyTextAuthor(canvas, authorText);
    // ctx.font = applyText(canvas, authorText, 20, '# Sans serif');
    // ctx.font = '20px Sans serif';
    ctx.fillStyle = '#494949';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';

    const spacing = 15;

    const authorX = titleX + titleTextWidth / 2;
    const authorY = titleY + titleTextHeight + spacing;

    ctx.fillText(authorText, authorX, authorY);

    // const authorX = Math.min(titleX + titleTextWidth, canvas.width - spacing);
    return canvas.toBuffer();
};
