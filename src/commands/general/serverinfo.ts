import {
    ApplicationCommandType,
    ChannelType,
    ColorResolvable,
    EmbedBuilder,
} from 'discord.js';
import { Command } from '../../lib';
import getColor from 'get-image-colors';

export default new Command({
    name: 'serverinfo',
    description: 'Server Information',
    type: ApplicationCommandType.ChatInput,

    run: async ({ interaction }) => {
        const { guild } = interaction;

        const totalCategories =
            guild?.channels.cache.filter(
                channel => channel?.type === ChannelType.GuildCategory
            ).size || 0;
        const totalThreads =
            guild?.channels.cache.filter(
                c =>
                    c.type === ChannelType.PublicThread ||
                    c.type === ChannelType.PrivateThread
            ).size || 0;
        const totalChannels =
            (guild?.channels.cache.size || 0) - totalCategories - totalThreads;
        const numTextChannel = guild?.channels.cache.filter(
            c => c.type === ChannelType.GuildText
        ).size;
        const numVoiceChannel = guild?.channels.cache.filter(
            channel => channel.type === ChannelType.GuildVoice
        ).size;
        const numForumChannel = guild?.channels.cache.filter(
            channel => channel.type === ChannelType.GuildForum
        ).size;

        const colors = await getColor(
            `${guild?.iconURL({ extension: 'png' })}`
        );
        const hexColors = colors.map(color => color.hex());
        const primaryColorHex = hexColors[0] as ColorResolvable;

        if (!guild) return;

        const serverCreatedTimestamp = Math.floor(
            guild?.createdTimestamp / 1000
        );

        const embed = new EmbedBuilder()
            .setTitle(guild?.name || "IGP's Coding Villa")
            .setThumbnail(`${guild?.iconURL()}`)
            .setColor(primaryColorHex)
            .setFields([
                {
                    name: 'Server ID',
                    value: `${guild?.id}`,
                    inline: true,
                },
                {
                    name: 'Total Members',
                    value: `${guild?.memberCount}`,
                    inline: true,
                },
                {
                    name: 'Server Owner',
                    value: `<@${guild?.ownerId}>`,
                    inline: true,
                },
                {
                    name: 'Server Created',
                    value: `<t:${serverCreatedTimestamp}:R>`,
                    inline: true,
                },
                {
                    name: 'Total Boosts',
                    value: `${guild?.premiumSubscriptionCount}`,
                    inline: true,
                },
                {
                    name: 'Total Channels',
                    value: `${totalChannels}`,
                    inline: true,
                },
                {
                    name: 'Text Channels',
                    value: `${numTextChannel}`,
                    inline: true,
                },
                {
                    name: 'Voice Channels',
                    value: `${numVoiceChannel}`,
                    inline: true,
                },
                {
                    name: 'Forum Channels',
                    value: `${numForumChannel}`,
                    inline: true,
                },
            ]);

        interaction.followUp({ embeds: [embed] });
    },
});
