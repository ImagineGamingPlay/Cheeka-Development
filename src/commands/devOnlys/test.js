const { MessageActionRow, MessageButton } = require("discord.js");
const CommandStructure = require("../../structure/CommandStructure").CommandStructure;

module.exports = {
	name: "test",
	description: "test",
	category: "Experimental",
	devOnly: true,
	/**
	 *
	 * @param {CommandStructure}
	 * @returns {Promise<*>}
	 */
	run: async ({ client, message, args }) => {
		message.reply({
			content: "test",
			components: [
				new MessageActionRow().addComponents(
					new MessageButton().setLabel("test").setCustomId("test-button").setStyle("PRIMARY"),
				),
			],
		});
	},
};
