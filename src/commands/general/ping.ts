import { EmbedBuilder } from 'discord.js';
import { Command } from '../../lib/classes/Command';

export default new Command({
  name: 'ping',
  description: 'View the connection status',

  run: async ({ interaction, client }) => {
    const embed = new EmbedBuilder({
      title: 'Ping Status',
      description: `Pong!`,
      color: client.config.colors.blurple,
      author: {
        name: interaction.user.username,
        iconURL: interaction.user.avatarURL() || '',
      },
      timestamp: new Date(),
    });

    interaction.editReply({ embeds: [embed] });
  },
});
