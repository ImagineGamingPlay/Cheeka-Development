import { EmbedBuilder } from 'discord.js';
import { client } from '../..';
import { Button } from '../../lib/classes/Button';

export default new Button({
    scope: 'tagDecline',
    run: async ({ interaction, id }) => {
        const tag = await client.prisma.tag.findUnique({
            where: {
                id: id,
            },
        });
        if (!tag) {
            interaction.followUp({
                content: "This tag doesn't exist!",
                ephemeral: true,
            });
            return;
        }

        await client.prisma.tag.delete({
            where: {
                id: id,
            },
        });

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tag declined!')
                    .setDescription(
                        `Tag \`${tag?.name}\` has been declined by ${interaction.user}`
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
                    .setTitle('Your Tag was Declined!')
                    .setDescription(
                        `Unfortunately, your request to create tag \`${tag?.name}\` was declined.`
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
