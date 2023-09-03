import { Button } from '../../lib/classes/Button';
import { client } from '../../';
import { EmbedBuilder, TextChannel } from 'discord.js';
import { config } from '../../config';
export default new Button({
    scope: 'mmclose',
    run: async ({ interaction, id }) => {
        const closeEmbed = new EmbedBuilder()
            .setDescription('Closing modmail thread in 5 seconds..')
            .setColor('Red');
        interaction.reply({ embeds: [closeEmbed], ephemeral: true });
        const user = client.users.cache.find(
            (user: { username: string }) => user.username === id
        );
        setTimeout(() => {
            const userDmEmbed = new EmbedBuilder()
                .setTitle('Modmail thread deleted!')
                .setDescription(
                    `Hey buddy! Your modmail thread has been deleted from ${interaction.guild?.name}!`
                )
                .setAuthor({
                    name: interaction.guild?.name ?? '',
                    iconURL: interaction.guild?.bannerURL() ?? undefined,
                })
                .addFields({
                    name: 'Deleted By',
                    value: interaction.user.username,
                })
                .setThumbnail(interaction?.guild?.bannerURL() ?? null)
                .setTimestamp()
                .setColor('Red')
                .setFooter({
                    text: 'If you have any queries, simply DM the bot again!',
                });
            user?.send({
                embeds: [userDmEmbed],
            });
            interaction.channel
                ?.delete(
                    `ModMail thread delete. Action By: ${interaction.user.username}`
                )
                .then(ch => {
                    const channel = ch as TextChannel;
                    const threadOwner = client.users.cache.find(
                        user => user.username === channel.name
                    );
                    const embed = new EmbedBuilder()
                        .setTitle('ModMail thread deleted')
                        .addFields(
                            { name: 'Thread ID', value: channel?.name },
                            {
                                name: 'Deleted By',
                                value: `${interaction.user} || ${interaction.user.id}`,
                            },
                            {
                                name: 'Thread Owner',
                                value: `${threadOwner} || ${threadOwner?.id}`,
                            }
                        )
                        .setColor('Red')
                        .setTimestamp()
                        .setThumbnail(threadOwner?.displayAvatarURL() ?? null);
                    const logs = interaction.guild?.channels.cache.get(
                        config.modMailLogsId
                    ) as TextChannel;
                    logs.send({
                        embeds: [embed],
                    });
                });
        }, 5 * 1000);
        return;
    },
});
