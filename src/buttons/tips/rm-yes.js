const tipsSchema = require("../../schema/tips");
const tipsCmd = require("../../commands/adminFunc/tips");

module.exports = {
	id: "rm-yes",
	run: async (client, interaction) => {
		tipsSchema.findOneAndDelete(
			{
				_id: tipsCmd.tipId,
			},
			async (err, data) => {
				if (err) throw err;
				if (data) {
					return interaction.message.edit({
						embeds: [
							{
								title: "Tip Removed!",
								description: `Tip **${
									data.tip
								}** has been removed!\n\n**Tip ID:** ${
									data._id
								}\n**Author:** ${interaction.guild.members.cache.get(
									data.authorId
								)} | ||${data.authorId}||\n**Deleted by:** ${
									interaction.member
								} | ||${interaction.member.id}||`,
								color: client.config.colors.success,
							},
						],
						components: [],
					});
				}
			}
		);
	},
};
