module.exports = {
	id: "rm-cancel",
	run: async (client, interaction) => {
		interaction.message.delete();
	},
};
