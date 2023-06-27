import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    PermissionFlagsBits,
} from 'discord.js';
import { Command } from '../../lib';
import { logger } from 'console-wizard';

export default new Command({
    name: 'kick',
    description: 'Kick a member',
    options: [
        {
            name: 'member',
            description: 'Choose the member to kick',
            required: true,
            type: ApplicationCommandOptionType.User,
        },
        {
            name: 'reason',
            description: 'Reason for the kick',
            required: false,
            type: ApplicationCommandOptionType.String,
        },
    ],

    defaultMemberPermissions: [PermissionFlagsBits.KickMembers],

    run: async ({ client, interaction, options }) => {
        const member = options?.getUser('member');
        const reason = options?.getString('reason') || 'No reason given';

        if (!member) return;

        const guildMember = interaction.guild?.members.cache.get(member?.id);

        const notKickableErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot kick ${guildMember?.user.username}!`)
            .setDescription(
                `I do not have sufficient permissions to kick <@${guildMember?.id}>!`
            )
            .setColor(client.config.colors.red);

        const userLackingPermsErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot kick ${guildMember?.user.username}!`)
            .setDescription(
                `You cannot kick <@${guildMember?.id}> as they have a higher role that you!`
            )
            .setColor(client.config.colors.red);

        const successEmbed = new EmbedBuilder()
            .setTitle(`Kicked ${guildMember?.user.username}!`)
            .setDescription(
                `**Member ID:** ${guildMember?.id}\n**Reason:** ${reason}`
            )
            .setTimestamp()
            .setThumbnail(`${guildMember?.displayAvatarURL()}`)
            .setColor(client.config.colors.green);

        const errorEmbed = new EmbedBuilder()
            .setTitle(':red_circle: An unexpected error occured!')
            .setDescription(
                `<@${guildMember?.id} wasn't kicked due to an error.`
            )
            .setColor(client.config.colors.red);

        if (!guildMember?.kickable) {
            await interaction.followUp({ embeds: [notKickableErrorEmbed] });
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

        await guildMember
            ?.kick(reason)
            .then(() => interaction.followUp({ embeds: [successEmbed] }))
            .catch(async err => {
                await interaction.followUp({ embeds: [errorEmbed] });
                logger.error(err);
                return;
            });
    },
});
