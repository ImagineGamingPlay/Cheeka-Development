import { TagType } from '@prisma/client';
import { ApplicationCommandOptionType } from 'discord.js';
import { Command, tagCreateRequest, deleteTag } from '../../lib/';
import { TagProps } from '../../types';
import { viewTag } from '../../lib/functions/viewTag';
import { tagModifyRequest } from '../../lib/functions/tagModifyRequest';
import { getTagNames } from '../../lib/functions/getTagNames';

const TAG_TYPE = TagType.CODE;

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
                    autocomplete: true,
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
                    autocomplete: true,
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
                    autocomplete: true,
                },
            ],
        },
    ],
    autocomplete: async interaction => {
        const focused = interaction.options.getFocused();
        const tagChoices = await getTagNames(TAG_TYPE);

        const filtered = tagChoices.filter(choice =>
            choice.startsWith(focused)
        );
        await interaction.respond(
            filtered.map(choice => ({ name: choice, value: choice }))
        );
    },
    run: async ({ options, interaction }) => {
        if (!options) return;
        const subcommand = options?.getSubcommand();

        const name = options?.getString('name');
        if (!name) return;

        if (subcommand === 'view') {
            viewTag(name, TAG_TYPE, interaction);
        }

        if (subcommand === 'add') {
            const props: Omit<TagProps, 'ownerId' | 'content'> = {
                name,
                type: TAG_TYPE,
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
                type: TAG_TYPE,
            };
            await tagModifyRequest(props);
        }
    },
});
