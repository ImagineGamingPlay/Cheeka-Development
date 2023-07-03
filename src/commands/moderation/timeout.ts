import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { Command } from '../../lib';
import { logger } from 'console-wizard';
import ms from 'ms';
export default new Command({
    name: 'timeout',
    description: 'Timeout a member',
    options: [
        {
            name: 'member',
            description: 'Choose the member to timeout',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'duration',
            description: 'Timeout duration for the member',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'reason',
            description: 'Reason for the timeout',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],

    defaultMemberPermissions: [PermissionFlagsBits.KickMembers],

    run: async ({ client, interaction, options }) => {
        const member = options?.getUser('member');
        const reason = options?.getString('reason') || 'No reason given';
        const duration = options?.getString('duration');
        const durationMs = duration ? ms(duration) : 0;

        if (!member) return;

        const guildMember = interaction.guild?.members.cache.get(member?.id);

        const notTimeoutableErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot timeout ${guildMember?.user.username}!`)
            .setDescription(
                `I do not have sufficient permissions to timeout <@${guildMember?.id}>!`
            )
            .setColor(client.config.colors.red);

        const userLackingPermsErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot timeout ${guildMember?.user.username}!`)
            .setDescription(
                `You cannot timeout <@${guildMember?.id}> as they have a higher role that you!`
            )
            .setColor(client.config.colors.red);

        const successEmbed = new EmbedBuilder()
            .setTitle(`Timeouted ${guildMember?.user.username}!`)
            .setDescription(
                `**Member ID:** ${guildMember?.id}\n**Reason:** ${reason}`
            )
            .setTimestamp()
            .setThumbnail(`${guildMember?.displayAvatarURL()}`)
            .setColor(client.config.colors.green);

        const errorEmbed = new EmbedBuilder()
            .setTitle(':red_circle: An unexpected error occured!')
            .setDescription(
                `<@${guildMember?.id} wasn't timeouted due to an error.`
            )
            .setColor(client.config.colors.red);
        const invalidDurationEmbed = new EmbedBuilder()
            .setTitle('Invalid timeout duration!')
            .setDescription(`Please provided a valid timeout duration!`)
            .setColor(client.config.colors.red);
        const tooLongDurationEmbed = new EmbedBuilder()
            .setTitle('Invalid timeout duration!')
            .setDescription(
                'Timeout duration cannot be longer then 28 days or less then 5 seconds!'
            )
            .setColor(client.config.colors.red);
        if (!guildMember?.kickable) {
            await interaction.followUp({ embeds: [notTimeoutableErrorEmbed] });
            return;
        }

        const guildMemberHighestRole = guildMember.roles.highest;
        const userHighestRole = interaction.member.roles.highest;
        const rolePosition =
            guildMemberHighestRole.comparePositionTo(userHighestRole);
        if (rolePosition >= 0) {
            await interaction.followUp({
                embeds: [userLackingPermsErrorEmbed],
            });
            return;
        }

        if (isNaN(durationMs)) {
            await interaction.followUp({ embeds: [invalidDurationEmbed] });
        }

        if (durationMs < 5000 || durationMs > 2.419e9) {
            await interaction.followUp({ embeds: [tooLongDurationEmbed] });
        }

        await guildMember
            ?.timeout(durationMs, reason)
            .then(() => {
                interaction.followUp({ embeds: [successEmbed] });
            })
            .catch(async err => {
                await interaction.followUp({ embeds: [errorEmbed] });
                logger.error(err);
                return;
            });
    },
});
