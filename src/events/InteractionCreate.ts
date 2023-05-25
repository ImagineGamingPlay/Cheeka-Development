import {
  CacheType,
  CommandInteractionOptionResolver,
  Interaction,
} from 'discord.js';
import { client } from '..';
import { Event } from '../lib';
import { ModifiedCommandInteraction, RunParams } from '../types';

const handleSlashCommands = async (interaction: ModifiedCommandInteraction) => {
  await interaction.deferReply();

  const command = client.commands.get(interaction.commandName);
  const params: RunParams = {
    client,
    interaction,
    options: interaction.options as CommandInteractionOptionResolver<CacheType>,
  };

  await command?.run(params);
};

export default new Event('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    return await handleSlashCommands(interaction as ModifiedCommandInteraction);
  }
});
