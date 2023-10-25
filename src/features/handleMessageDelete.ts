import { EmbedBuilder, Message, TextBasedChannel } from 'discord.js';
import { config } from '../config';
import { client } from '..';
export const handleMessageDelete = async (message: Message) => {
    const deleteLogChannel = (await client.channels.fetch(
        config.deleteLogChannelId
    )) as TextBasedChannel;
    const content = message.content.length > 3500 ? message.content.slice(0,3500) : message.content;
    const deleteLogEmbed = new EmbedBuilder()
        .setTitle('Message Deleted')
        .setDescription(
            `**Message sent by ${message.author} was deleted in ${message.channel}**\n${content}`
        )
        .setAuthor({
            name: message.author.username,
            iconURL: message.author.displayAvatarURL(),
        })
        .setTimestamp()
        .setFooter({
            text: `Author: ${message.author.id} || ${message.author.username} Message ID: ${message.id}`,
        });

    deleteLogChannel?.send({ embeds: [deleteLogEmbed] });
};
