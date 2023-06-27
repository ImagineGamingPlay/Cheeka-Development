import { EmbedBuilder } from 'discord.js';
import { client } from '../..';
import { Button } from '../../lib/classes/Button';

export default new Button({
    scope: 'tagAccept',

    run: async ({ interaction, id }) => {
        const tag = await client.prisma.tag.findUnique({
            where: {
                id,
            },
        });

        if (!tag) {
            interaction.followUp({
                content: "This tag doesn't exist!",
                ephemeral: true,
            });
        }

        await client.prisma.tag.update({
            where: {
                id,
            },
            data: {
                accepted: true,
            },
        });

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tag accepted!')
                    .setDescription(
                        `Tag \`${tag?.name}\` has been accepted by ${interaction.user}`
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
    },
});
