import { CommandInteraction, Interaction, InteractionTypes } from 'eris';
import { client } from '..';
import { Event } from '../lib';
import { RunParams } from '../types';

const handleSlashCommands = async (interaction: CommandInteraction) => {
  await interaction.defer();

  const command = client.commands.get(interaction.data.name);
  const params: RunParams = {
    client,
    interaction,
    options: interaction.data.options,
  };
  command?.run(params);
};

export default new Event('interactionCreate', async (interaction: Interaction) => {
  // console.log(interaction.type);
  // console.log(Constants.ApplicationCommandTypes.CHAT_INPUT);
  if (interaction.type == 2) {
    return await handleSlashCommands(interaction as CommandInteraction);
  }
});
