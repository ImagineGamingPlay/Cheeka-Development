import { EmbedBuilder } from 'discord.js';
import { client } from '../..';
import { Button } from '../../lib/classes/Button';

export default new Button({
    scope: 'tagModifyDecline',

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
                newContent: null,
            },
        });

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tag Update Request Declined!')
                    .setDescription(
                        `Tag \`${tag?.name}\` has been declined for updating by ${interaction.user}`
                    )
                    .setColor(client.config.colors.red),
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
                    .setTitle('Your Tag Update Request was Declined!')
                    .setDescription(
                        `Unfortunately, your request to update tag \`${tag?.name}\` was declined.`
                    )
                    .setAuthor({
                        name: `${guild?.name}`,
                        iconURL: `${guild?.iconURL()}`,
                    })
                    .setColor(client.config.colors.red),
            ],
        });
    },
});
