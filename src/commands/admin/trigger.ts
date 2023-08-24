import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord.js';
import { prisma } from '../..';
import { Command } from '../../lib';
import { cacheTriggerPatterns } from '../../lib/functions/cacheData';
import { handleTriggerPattern, handleTriggerType } from '../../modules';

export default new Command({
    name: 'trigger',
    description: 'Create/Delete Triggers',
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ['KickMembers'],
    options: [
        {
            name: 'type',
            description: 'Update trigger types',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'add',
                    description: 'Add a trigger type',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'name',
                            description: 'Name of the trigger type',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'reply_message',
                            description: 'The content of the message to reply',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'delete',
                    description: 'Delete a trigger type',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'name',
                            description: 'Name of the type to delete',
                            type: ApplicationCommandOptionType.String,
                            // choices: triggerTypeChoiceData,
                            autocomplete: true,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'modify',
                    description: 'Delete a trigger',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'name',
                            description: 'Name of the type to modify',
                            type: ApplicationCommandOptionType.String,
                            // choices: triggerTypeChoiceData,
                            autocomplete: true,
                            required: true,
                        },
                        {
                            name: 'reply_message',
                            description: 'The content of the message to reply',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
            ],
        },
        {
            name: 'pattern',
            description: 'Modify trigger patterns',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'add',
                    description: 'Add a trigger pattern',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'type',
                            description:
                                'Select the type of trigger you want to add',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            // choices: triggerTypeChoiceData,
                            autocomplete: true,
                        },
                        {
                            name: 'pattern',
                            description:
                                'string or regex (javascript syntax for regex)',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: 'delete',
                    description: 'Delete a trigger pattern',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'type',
                            description:
                                'Select the type of trigger you want to delete',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            // choices: triggerTypeChoiceData,
                            autocomplete: true,
                        },
                        {
                            name: 'pattern',
                            description:
                                'string or regex (javascript syntax for regex)',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            autocomplete: true,
                        },
                    ],
                },
            ],
        },
    ],
    async autocomplete(interaction) {
        const { name, value } = interaction.options.getFocused(true);

        if (name === 'pattern') {
            const triggers = await prisma.trigger.findMany();
            if (!triggers) return;

            const choices = triggers.reduce((acc, cur) => {
                return [...acc, ...cur.regexMatch, ...cur.stringMatch];
            }, [] as string[]);

            const filtered = choices.filter(c => c.includes(value));
            await interaction.respond(
                filtered.map(c => ({ name: c, value: c }))
            );
        }
        if (name === 'name' || name === 'type') {
            const triggers = await prisma.trigger.findMany();
            const choices = triggers.map(trigger => ({
                name: trigger.type,
                value: trigger.type,
            }));

            const filtered = choices.filter(c => c.name.includes(value));
            await interaction.respond(filtered);
        }
    },
    run: async ({ interaction }) => {
        await interaction.deferReply();
        const subcommandGroup = interaction.options.getSubcommandGroup();
        if (!subcommandGroup) return;

        if (subcommandGroup === 'type') await handleTriggerType(interaction);
        if (subcommandGroup === 'pattern') {
            await handleTriggerPattern(interaction);
        }
        // Cache the trigger patterns
        await cacheTriggerPatterns();
    },
});
