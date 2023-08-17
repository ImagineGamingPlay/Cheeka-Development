import {
    ApplicationCommandOptionChoiceData,
    ApplicationCommandOptionType,
    ApplicationCommandType,
} from 'discord.js';
import { client } from '../..';
import { Command } from '../../lib';
import { cacheTriggerPatterns } from '../../lib/functions/cacheData';

const triggerTypes = ['rep'];
const triggerTypeChoiceData: ApplicationCommandOptionChoiceData<string>[] =
    triggerTypes.map(type => ({ name: type, value: type }));

export default new Command({
    name: 'addtrigger',
    description: 'Add Trigger (very useful description, I know)',
    type: ApplicationCommandType.ChatInput,
    defaultMemberPermissions: ['KickMembers'],
    options: [
        {
            name: 'type',
            description: 'Select the type of trigger you want to add',
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: triggerTypeChoiceData,
        },
        {
            name: 'pattern',
            description: 'string or regex (javascript syntax for regex)',
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: 'msg',
            description:
                'Optionally, you can update the trigger reply message too!',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],
    run: async ({ interaction, options }) => {
        const pattern = options?.getString('pattern');
        if (!pattern) return;

        const type = options?.getString('type');
        if (!type) return;

        const msg =
            options?.getString('msg') ||
            'No trigger message content. Add one by `/addTrigger type:type msg:content_here`';
        const isRegex = pattern.startsWith('/');

        const config = await client.prisma.config.findFirst();
        if (!config) return;

        if (isRegex) {
            await client.prisma.trigger.upsert({
                where: {
                    name: type,
                },
                create: {
                    name: type,
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
                    name: type,
                },
                create: {
                    name: type,
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
