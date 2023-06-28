import { TagType } from '@prisma/client';
import { ApplicationCommandOptionType } from 'discord.js';
import { Command, tagCreateRequest, deleteTag } from '../../lib/';
import { TagProps } from '../../types';
import { viewTag } from '../../lib/functions/viewTag';
import { tagModifyRequest } from '../../lib/functions/tagModifyRequest';

export default new Command({
    name: 'code',
    description: 'View and manage the code snippets!',
    options: [
        {
            name: 'view',
            description: 'view a code snippet!',
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
            name: 'modify',
            description: 'modify a code snippet!',
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
            name: 'delete',
            description: 'delete a code snippet!',
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
    ],
    run: async ({ options, interaction }) => {
        if (!options) return;
        const subcommand = options?.getSubcommand();

        const name = options?.getString('name');
        if (!name) return;

        if (subcommand === 'view') {
            viewTag(name, interaction);
        }

        if (subcommand === 'add') {
            const props: Omit<TagProps, 'ownerId' | 'content'> = {
                name,
                type: TagType.CODE,
                interaction,
            };
            await tagCreateRequest(props);

            return;
        }
        if (subcommand === 'delete') {
            await deleteTag(options.getString('name') || '', interaction);
            return;
        }
        if (subcommand === 'modify') {
            const props: Omit<TagProps, 'options' | 'content' | 'ownerId'> = {
                name,
                interaction,
                type: TagType.CODE,
            };
            await tagModifyRequest(props);
        }
    },
});
