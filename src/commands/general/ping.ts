import { Constants } from 'eris';
import { Command } from '../../lib/classes/Command';

export default new Command({
  name: 'ping',
  description: 'Pong! by teeka',
  type: Constants.ApplicationCommandTypes.CHAT_INPUT,
  run: async ({ interaction }) => {
    interaction.createMessage({ content: 'Pong!' });
  },
});
