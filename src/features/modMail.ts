import {
    ChannelType,
    Message,
    Webhook,
    EmbedBuilder,
    PermissionsBitField,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    TextChannel,
} from 'discord.js';
import { config } from '../config';
import { client } from '..';

export const modMail = async (message: Message) => {
    const user = client.users.cache.find(user => {
        if (message.channel.type === ChannelType.GuildText) {
            if (user.username === message.channel.name) {
                return user;
            }
        }
    });
    const category = config.modMailCategoryId;
    const staff = config.staffRoleId;
    const guild = client.guilds.cache.get(config.guildId);
    const logs = client.channels.cache.get(config.modMailLogsId) as TextChannel;
    if (message.channel.type === ChannelType.DM) {
        const checking = !!guild?.channels.cache.find(channel => {
            if (channel.type === ChannelType.GuildText) {
                return channel.name === message.author.username;
            }
        });
        if (checking === true) {
            const mailChannel = guild?.channels.cache.find(channel => {
                if (channel.type === ChannelType.GuildText) {
                    return channel.name === message.author.username;
                }
            });
            if (mailChannel?.type === ChannelType.GuildText) {
                const allWebhooks = await mailChannel.fetchWebhooks();
                const UserWebHook = allWebhooks.find(
                    webhook => webhook.name === message.author.username
                ) as Webhook;
                if (!UserWebHook) return;
                if (message.attachments && message.content === '') {
                    message.react('✅');
                    UserWebHook?.send({
                        files: Array.from(message.attachments.values()),
                    });
                } else if (message.attachments.size === 0 && message.content) {
                    message.react('✅');
                    UserWebHook?.send({
                        content: message.content,
                    });
                } else if (message.attachments && message.content) {
                    message.react('✅');
                    UserWebHook?.send({
                        files: Array.from(message.attachments.values()),
                        content: message.content,
                    });
                }
            }
        } else {
            message.react('✅');
            const embed = new EmbedBuilder()
                .setTitle('Modmail has been created')
                .setDescription(
                    'Please wait for a staff member to join the thread to start your conversation'
                )
                .setColor('Blurple')
                .setTimestamp()
                .setFooter({
                    text: 'Please have a valid reason to create a modmail thread.',
                });
            message.reply({
                embeds: [embed],
            });
            const mailChannel = await guild?.channels.create({
                name: message.author.username,
                type: ChannelType.GuildText,
                parent: category,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },
                    {
                        id: staff,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ],
            });
            const UserWebHook = await mailChannel?.createWebhook({
                name: message.author.username,
                avatar: message.author.avatarURL(),
            });
            const modMailThreadEmbed = new EmbedBuilder()
                .setTitle('New modmail thread')
                .addFields(
                    {
                        name: 'Creator',
                        value: `${message.author} || ${message.author.id}`,
                    },
                    {
                        name: 'Created at',
                        value: `<t:${Math.floor(
                            message?.createdAt.valueOf() / 1000
                        )}:R>`,
                    }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp()
                .setColor('Blurple');
            const modMailButtons =
                new ActionRowBuilder<ButtonBuilder>().setComponents(
                    new ButtonBuilder()
                        .setLabel('Close')
                        .setCustomId(`mmclose-${message.author.username}`)
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setLabel('Pause')
                        .setCustomId(`mmpause-${message.author.username}`)
                        .setStyle(ButtonStyle.Success)
                );
            mailChannel?.send({
                embeds: [modMailThreadEmbed],
                components: [modMailButtons],
            });
            const logsEmbed = new EmbedBuilder()
                .setTitle('New modmail thread has been created')
                .addFields(
                    {
                        name: 'Created by',
                        value: `${message.author} || ${message.author.id}`,
                    },
                    {
                        name: 'Created at',
                        value: `<t:${Math.floor(
                            message?.createdAt.valueOf() / 1000
                        )}:R>`,
                    },
                    { name: 'Thread', value: `${mailChannel}` }
                )
                .setThumbnail(message.author.displayAvatarURL())
                .setTimestamp()
                .setColor('Blurple');
            logs?.send({
                embeds: [logsEmbed],
            });
            if (message.attachments && message.content === '') {
                UserWebHook?.send({
                    files: Array.from(message.attachments.values()),
                });
            } else if (message.attachments.size === 0 && message.content) {
                UserWebHook?.send({
                    content: message.content,
                });
            } else if (message.attachments && message.content) {
                UserWebHook?.send({
                    files: Array.from(message.attachments.values()),
                    content: message.content,
                });
            }
        }
    }
    if (!message?.guild) return;
    if (
        message.guild.id === guild?.id &&
        (message.channel as unknown as TextChannel).parentId === category
    ) {
        if (
            message.content.startsWith('//') ||
            message.content.startsWith('((')
        )
            return;
        if (message.channel.id === config.modMailDiscussionId) return;
        if (message.attachments && message.content === '') {
            user?.send({ files: Array.from(message.attachments.values()) });
        } else if (message.attachments.size === 0 && message.content) {
            user?.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL(),
                        })
                        .setColor('Green')
                        .setTimestamp()
                        .setDescription(message.content),
                ],
            });
        } else if (message.attachments && message.content) {
            user?.send({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({
                            name: message.author.tag,
                            iconURL: message.author.displayAvatarURL(),
                        })
                        .setColor('Green')
                        .setTimestamp()
                        .setDescription(message.content),
                ],
                files: Array.from(message.attachments.values()),
            });
        }
    }
};
