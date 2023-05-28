import { Command } from '../../lib/';
import { ApplicationCommandOptionType } from 'discord.js';

export default new Command({
  name: 'code',
  description: 'View and manage the code snippets!',
  options: [
    {
      name: 'view',
      description: 'add a code snippet!',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: 'name',
          description: 'name of the code snippet',
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    },
    {
      name: 'add',
      description: 'add a code snippet!',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'modify',
      description: 'add a code snippet!',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: 'delete',
      description: 'add a code snippet!',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async ({ options }) => {
    const subcommand = options?.getSubcommand();
    if (subcommand == 'view') {
    }
  },
});
