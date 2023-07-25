import { ApplicationCommandType, EmbedBuilder } from 'discord.js';
import { Command } from '../../lib';
import { addRep } from '../../modules';
import { client } from '../..';

export default new Command({
    name: '+ rep',
    type: ApplicationCommandType.User,
    run: async ({ interaction }) => {
        if (interaction.targetUser.id === interaction.user.id) {
            await interaction.reply({
                content: 'You cannot add reputation to yourself!',
                ephemeral: true,
            });
            return;
        }
        await addRep(interaction.targetUser.id, interaction);
        await interaction.reply({
            embeds: [
                new EmbedBuilder({
                    title: 'Reputation Added!',
                    description: `You have added reputation to ${interaction.targetMember}!`,
                    footer: {
                        text: 'Only add reputation to people who helped you. False reputations will be removed the the user will be punished.',
                    },
                    color: client.config.colors.green,
                }),
            ],
            ephemeral: false,
        });
    },
});
