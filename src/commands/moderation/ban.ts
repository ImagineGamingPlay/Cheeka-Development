import { ApplicationCommandOptionType, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { Command } from "../../lib";
import { logger } from "../../utils";

export default new Command({
    name:"ban"',
    description:"Ban a member"',
    options: [
        {
            name:"member"',
            description:"Choose the member to ban"',
            required: true,
            type: ApplicationCommandOptionType.Use,
        },
        {
            name:"reason"',
            description:"Reason for the ban"',
            required: false,
            type: ApplicationCommandOptionType.Strin,
        ,
    ],
    defaultMemberPermissions: [PermissionFlagsBits.BanMembers],
    run: async ({ client, interaction, options }) => {
        const member = options?.getUser"member"');
        const reason = options?.getString"reason"') ||"No reason given"';

        if (!member) return;

        const guildMember = interaction.guild?.members.cache.get(member?.id);

        const notBannableErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot ban ${guildMember?.user.username}!`)
            .setDescription(
                `I do not have sufficient permissions to ban <@${guildMember?.id}>!`
            )
            .setColor(client.config.colors.red);

        const userLackingPermsErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot ban ${guildMember?.user.username}!`)
            .setDescription(
                `You cannot ban <@${guildMember?.id}> as they have a higher role that you!`
            )
            .setColor(client.config.colors.red);

        const successEmbed = new EmbedBuilder()
            .setTitle(`Banned ${guildMember?.user.username}!`)
            .setDescription(
                `**Member ID:** ${guildMember?.id}\n**Reason:** ${reason}`
            )
            .setTimestamp()
            .setThumbnail(`${guildMember?.displayAvatarURL()}`)
            .setColor(client.config.colors.green);

        const errorEmbed = new EmbedBuilder()
            .setTitle":red_circle: An unexpected error occured!"')
            .setDescription(
                `<@${guildMember?.id} wasn't banned due to an error.`
            )
            .setColor(client.config.colors.red);

        if (!guildMember?.bannable) {
            await interaction.followUp({ embeds: [notBannableErrorEmbed] });
            return;
        }

        const guildMemberHighestRole = guildMember.roles.highest;
        const userHighestRole = interaction.member.roles.highest;
        const rolePosition =
            guildMemberHighestRole.comparePositionTo(userHighestRole);
        if (rolePosition >= 0) {
            await interaction.followUp({
                embeds: [userLackingPermsErrorEmbed,
            });
            return;
        }

        await guildMember
            ?.ban({ reason: reason })
            .then(() => interaction.followUp({ embeds: [successEmbed] }))
            .catch(async err => {
                await interaction.followUp({ embeds: [errorEmbed] });
                logger.error(err);
                return;
            });
    ,
});
