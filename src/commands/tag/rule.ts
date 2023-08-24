import { TagType } from '@prisma/client';
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    PermissionFlagsBits,
} from 'discord.js';
import { Command, deleteTag, tagCreateRequest } from '../../lib/';
import { getTagNames } from '../../lib/functions/getTagNames';
import { tagModifyRequest } from '../../lib/functions/tagModifyRequest';
import { viewTag } from '../../lib/functions/viewTag';
import { TagProps } from '../../types';

const TAG_TYPE = TagType.RULE;

// const tagChoices = getTagChoices(TAG_TYPE);

export default new Command({
    name: 'rule',
    description: 'View and manage the rule tags!',
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'view',
            description: 'view a rule tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the rule tag',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
        },
        {
            name: 'add',
            description: 'add a rule tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the rule tag',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: 'modify',
            description: 'modify a rule tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the rule tag',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
        },
        {
            name: 'delete',
            description: 'delete a rule tag!',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'name',
                    description: 'name of the rule tag',
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

        const isAdmin = interaction.member.permissions.has(
            PermissionFlagsBits.Administrator
        );

        if (subcommand !== 'view' && !isAdmin) {
            interaction.reply({
                content:
                    'You do not have permissions to add, modify or delete rule tags!',
                ephemeral: true,
            });

            return;
        }

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
