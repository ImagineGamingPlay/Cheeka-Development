import { EmbedBuilder, Message, TextBasedChannel } from 'discord.js';
import { config } from '../config';
import { client } from '..';
export const handleMessageUpdate = async (
    oldMessage: Message,
    newMessage: Message
) => {
    const editLogChannel = (await client.channels.fetch(
        config.editLogChannelId
    )) as TextBasedChannel;
    const oldContent = oldMessage.content;
    const newContent = newMessage.content;

    if (oldContent.length > 3500) {
        oldContent.slice(0, 3500);
    }

    if (newContent.length > 3500) {
        newContent.slice(0, 3500);
    }

    const deleteLogEmbed = new EmbedBuilder()
        .setTitle('Message Updated')
        .setDescription(
            `**Message sent by ${newMessage.author} was updated in ${newMessage.channel}**\n**Old Content**\n${oldContent}\n**New content**\n${newContent}`
        )
        .setAuthor({
            name: newMessage.author.username,
            iconURL: newMessage.author.displayAvatarURL(),
        })
        .setTimestamp()
        .setFooter({
            text: `Author: ${newMessage.author.id} || ${newMessage.author.username} Message ID: ${newMessage.id}`,
        });

    editLogChannel?.send({ embeds: [deleteLogEmbed] });
};
