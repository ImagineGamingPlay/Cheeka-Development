import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord.js';
import { client, prisma } from '../..';
import { Command } from '../../lib';
import { cacheTriggerPatterns } from '../../lib/functions/cacheData';
import { handleTriggerPattern, handleTriggerType } from '../../modules';

const triggerTypes = await (async () => {
    return await prisma.trigger.findMany();
})();

const triggerTypeChoiceData = triggerTypes.map(trigger => ({
    name: trigger.type,
    value: trigger.type,
}));

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
                            choices: triggerTypeChoiceData,
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
                            choices: triggerTypeChoiceData,
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
                            choices: triggerTypeChoiceData,
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
                            choices: triggerTypeChoiceData,
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
        const focused = interaction.options.getFocused();
        const type = interaction.options.getString('type');
        if (!type) return;

        const trigger = await prisma.trigger.findUnique({
            where: {
                type,
            },
        });
        if (!trigger) return;

        const choices = [...trigger.regexMatch, ...trigger.stringMatch];

        const filtered = choices.filter(c => c.includes(focused));
        await interaction.respond(filtered.map(c => ({ name: c, value: c })));
    },
    run: async ({ interaction, options }) => {
        await interaction.deferReply();
        const subcommandGroup = interaction.options.getSubcommandGroup();
        if (!subcommandGroup) return;

        if (subcommandGroup === 'type') await handleTriggerType(interaction);
        if (subcommandGroup === 'pattern') {
            await handleTriggerPattern(interaction);
        }

        const pattern = options?.getString('pattern');
        if (!pattern) return;

        const type = options?.getString('type');
        if (!type) return;

        const msg =
            options?.getString('msg') ??
            'No trigger message content. Add one by `/trigger add type:type msg:content_here`';
        const isRegex = pattern.startsWith('/');

        const config = await client.prisma.config.findFirst();
        if (!config) return;

        if (isRegex) {
            await client.prisma.trigger.upsert({
                where: {
                    type,
                },
                create: {
                    type,
                    stringMatch: [pattern],
                    regexMatch: [],
                    replyMessageContent: msg,
                    config: {
                        connect: config,
                    },
                },
                update: {
                    regexMatch: {
                        push: pattern,
                    },
                },
            });
        } else {
            await client.prisma.trigger.upsert({
                where: {
                    type,
                },
                create: {
                    type,
                    stringMatch: [pattern],
                    regexMatch: [],
                    replyMessageContent: msg,
                    config: {
                        connect: config,
                    },
                },
                update: {
                    regexMatch: {
                        push: pattern,
                    },
                },
            });
        }

        // Cache the trigger patterns
        await cacheTriggerPatterns();

        await interaction.reply({
            content: `Added ${pattern} to ${type} trigger!`,
        });
    },
});
