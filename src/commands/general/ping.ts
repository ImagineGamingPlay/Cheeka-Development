import { Constants, EmbedOptions } from 'eris';
import { Command } from '../../lib/classes/Command';

export default new Command({
  name: 'ping',
  description: 'View the connection status',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,

  run: async ({ interaction, client }) => {
    const embed: EmbedOptions = {
      title: 'Ping Status',
      description: `Pong!`,
      color: client.config.colors.blurple,
      author: {
        name: interaction.member?.username || '',
        icon_url: interaction.member?.user.dynamicAvatarURL(),
      },
      timestamp: new Date(),
    };

    interaction.createMessage({ embeds: [embed] });
  },
});
