import { EmbedBuilder } from 'discord.js';
import { client } from '../..';
import { Button } from '../../lib/classes/Button';
import { modifyTag } from '../../lib/functions/modifyTag';

export default new Button({
    scope: 'tagModifyAccept',
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
        if (!tag.newContent) {
            interaction.reply({
                content: "This tag doesn't have a new content!",
            });
            return;
        }

        await modifyTag(tag?.name, tag?.newContent);

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tag Update Request Accepted!')
                    .setDescription(
                        `Tag \`${tag?.name}\` update request has been accepted by ${interaction.user}`
                    )
                    .setColor(client.config.colors.green),
            ],
        });
        const guild = client.guilds.cache.get(client.config.guildId);
        const owner = guild?.members.cache.get(tag?.ownerId || '');

        if (!owner) {
            interaction.reply(`WARNING: Tag owner of ${tag?.name} not found!`);
            return;
        }

        owner.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Your Tag Update Request was Accepted!')
                    .setDescription(
                        `Your request to update tag \`${tag?.name}\` was accepted!`
                    )
                    .setAuthor({
                        name: `${guild?.name}`,
                        iconURL: `${guild?.iconURL()}`,
                    })
                    .setColor(client.config.colors.green),
            ],
        });
    },
});
