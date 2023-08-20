import { TagType } from '@prisma/client';
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord.js';
import { Command, tagCreateRequest, deleteTag } from '../../lib/';
import { TagProps } from '../../types';
import { viewTag } from '../../lib/functions/viewTag';
import { tagModifyRequest } from '../../lib/functions/tagModifyRequest';
import { getTagNames } from '../../lib/functions/getTagNames';
// import { getTagChoices } from '../../lib/functions/getTagChoices';

const TAG_TYPE = TagType.INFO;

// const tagChoices = await getTagChoices(TAG_TYPE);

export default new Command({
    name: 'info',
    description: 'View and manage the info tags!',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'view',
            description: 'view a info tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the info tag',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
        },
        {
            name: 'add',
            description: 'add a info tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the info tag',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'modify',
            description: 'modify a info tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the info tag',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
        },
        {
            name: 'delete',
            description: 'delete a info tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the info tag',
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

        const filtered = tagChoices.filter(choice => choice.includes(focused));
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
