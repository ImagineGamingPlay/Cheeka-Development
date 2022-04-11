const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	id: "role-selector-menu",
	run: async (client, interaction) => {
		const { values } = interaction;

		await interaction.editReply({
			content: "updating your roles...",
			components: [
				new MessageActionRow().addComponents(
					new MessageButton()
						.setLabel("show my roles")
						.setStyle("PRIMARY")
						.setCustomId("show-my-roles")
				),
			],
			ephemeral: true,
		});

		for (const id of values) {
			if (!interaction.member.roles.cache.has(id)) {
				await interaction.member.roles.add(id, ["self-assignable role"]);
				interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setColor("GREEN")
							.setTitle("Roles Added")
							.setDescription(`Added role(s): <@&${id}>`),
					],
					ephemeral: true,
				});
			} else if (interaction.member.roles.cache.has(id)) {
				await interaction.member.roles.remove(id, ["self-assignable role"]);
				interaction.followUp({
					embeds: [
						new MessageEmbed()
							.setColor("RED")
							.setTitle("Roles removed")
							.setDescription(`Removed role(s): <@&${id}>`),
					],
					ephemeral: true,
				});
			}
		}
	},
};
