import { ApplicationCommandType } from 'discord.js';
import { Command } from '../../lib';
import { addRep } from '../../modules';

export default new Command({
    name: '+ rep',
    type: ApplicationCommandType.User,
    run: async ({ interaction }) => {
        await addRep(interaction.targetMember, interaction);
    },
});
