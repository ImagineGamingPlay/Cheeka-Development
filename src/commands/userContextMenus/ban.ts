import { logger } from 'console-wizard';
import {
    ActionRowBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    PermissionFlagsBits,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';
import { Command } from '../../lib';

export default new Command({
    name: 'ban',
    type: ApplicationCommandType.User,
    defaultMemberPermissions: [PermissionFlagsBits.BanMembers],

    run: async ({ client, interaction }) => {
        const target = interaction.targetMember;

        const notBannableErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot ban ${target?.user.username}!`)
            .setDescription(
                `I do not have sufficient permissions to ban <@${target?.id}>!`
            )
            .setColor(client.config.colors.red);

        const rolePosErrorEmbed = new EmbedBuilder()
            .setTitle(`Cannot ban ${target?.user.username}!`)
            .setDescription(
                `You cannot ban <@${target?.id}> as they have a higher role that you!`
            )
            .setColor(client.config.colors.red);

        const errorEmbed = new EmbedBuilder()
            .setTitle(':red_circle: An unexpected error occured!')
            .setDescription(`< @${target?.id} wasn't banned due to an error.`)
            .setColor(client.config.colors.red);

        if (!target?.bannable) {
            await interaction.reply({ embeds: [notBannableErrorEmbed] });
            return;
        }

        const targetHighestRolePos = target.roles.highest.position;
        const userHighestRolePos = interaction.member.roles.highest.position;
        if (targetHighestRolePos > userHighestRolePos) {
            await interaction.reply({
                embeds: [rolePosErrorEmbed],
            });
            return;
        }

        const modal = new ModalBuilder()
            .setCustomId('ban-reason')
            .setTitle('Reason');

        const reasonInput = new TextInputBuilder()
            .setCustomId('reasonInput')
            .setLabel('Please specifiy the reason for the ban')
            .setPlaceholder('No reason provided')
            .setStyle(TextInputStyle.Paragraph)

            .setRequired(false);

        const row = new ActionRowBuilder<ModalActionRowComponentBuilder>({
            components: [reasonInput],
        });
        modal.addComponents(row);

        await interaction.showModal(modal);

        const modalInteraction = await interaction.awaitModalSubmit({
            time: 2 * 60 * 1000, // 2 minutes
        });

        const reason =
            modalInteraction.fields.getTextInputValue('reasonInput') ??
            'No reason provided';

        const successEmbed = new EmbedBuilder()
            .setTitle(`Banned ${target?.user.username}!`)
            .setTimestamp()
            .setColor(client.config.colors.green);
        try {
            await target.send({
                embeds: [
                    new EmbedBuilder({
                        title: 'You have been banned!',
                        description: `You have been **banned** from **${interaction.guild?.name}**.`,
                        fields: [
                            {
                                name: 'Reason',
                                value: reason,
                            },
                        ],
                        author: {
                            name: `${interaction.guild?.name}`,
                            iconURL: `${interaction.guild?.iconURL()}`,
                        },
                        color: client.config.colors.red,
                    }),
                ],
            });
        } catch (err) {
            return;
        }

        await target?.ban({ reason: reason }).catch(async err => {
            await interaction.reply({ embeds: [errorEmbed] });
            logger.error(err);
            return;
        });

        await modalInteraction.reply({ embeds: [successEmbed] });
    },
});
