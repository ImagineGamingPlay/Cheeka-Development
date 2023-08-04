import { createCanvas } from 'canvas';
import {
    AttachmentBuilder,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    TextChannel,
} from 'discord.js';
import { client } from '..';
import { idData } from '../data';
import { writeFileSync } from 'fs';

type TopReps = {
    [key: string]: number;
};

const generateRepLeaderboardBar = async (topReps: TopReps) => {
    const totalSum = Object.values(topReps).reduce(
        (sum, value) => sum + value,
        0
    );

    const topRepPercentage: TopReps = {};
    for (const key in topReps) {
        const value = topReps[key];
        const percentage = (value / totalSum) * 100;
        topRepPercentage[key as keyof TopReps] = Math.round(percentage);
    }

    const colors = ['#c2c1c2', '#455eb5', '#4c5c87', '#3a306e', '#3b1a5f'];

    const canvas = createCanvas(400, 180);
    const ctx = canvas.getContext('2d');
    let startX = 0;

    Object.values(topRepPercentage)
        .sort((a, b) => b - a)
        .forEach((entry, i) => {
            const barWidth = (canvas.width * entry) / 100;

            ctx.fillStyle = colors[i];
            ctx.fillRect(startX, 0, barWidth, 60);
            startX += barWidth;
        });

    const x = 0;
    let y = 80;
    Object.keys(topRepPercentage)
        .sort((a, b) => topRepPercentage[b] - topRepPercentage[a])
        .forEach((entry, i) => {
            ctx.fillStyle = colors[i];
            ctx.fillRect(x, y, 10, 10);
            ctx.fillStyle = colors[i];
            ctx.font = '14px Arial';
            ctx.fillText(`${entry} (${topReps[entry]})`, x + 20, y + 10);
            y += 20;
        });
    return canvas.toBuffer();
    writeFileSync('sans.png', canvas.toBuffer());
};

export const updateRepLeaderboard = async () => {
    const reps = await client.prisma.reputation.findMany();
    const topReps: TopReps = {};

    const sortedTopReps = reps.sort((a, b) => b.count - a.count).slice(0, 5);

    for (const rep of sortedTopReps) {
        const user = await client.users.fetch(rep.userId);
        topReps[user.username] = rep.count;
    }
    console.log(topReps);

    const barBuffer = await generateRepLeaderboardBar(topReps);
    writeFileSync('bar.png', barBuffer);
    const barAttachment = new AttachmentBuilder(barBuffer, {
        name: 'bar.png',
        description: 'Leaderboard Bar',
    });

    const embed = new EmbedBuilder({
        title: 'Reputations Leaderboard',
        color: client.config.colors.blurple,
        image: {
            url: 'attachment://bar.png',
        },
    });

    const config = await client.prisma.config.findFirst();

    const output = {
        embeds: [embed],
        files: [barAttachment],
    };

    const channel = client.channels.cache.get(
        idData.channels.repLeaderboardChannel
    ) as TextChannel | undefined;

    if (!config || !config.repLeaderboardMsgId) {
        const msg = await channel?.send(output);
        await client.prisma.config.create({
            data: {
                repLeaderboardMsgId: msg?.id,
            },
        });
        return;
    }
    const message = await channel?.messages.fetch(config.repLeaderboardMsgId);

    await message?.edit(output);
};

export const manageRepRole = async (
    member: GuildMember,
    interation: CommandInteraction
) => {
    const role = await interation.guild?.roles.fetch('1136925691301072937');
    if (!role) return;

    const rep = await client.prisma.reputation.findUnique({
        where: {
            userId: member.id,
        },
    });
    if (!rep) return;

    if (rep.count >= 10) {
        await member.roles.add('1136925691301072937');
    }
};
