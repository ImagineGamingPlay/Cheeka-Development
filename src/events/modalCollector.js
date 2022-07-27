const { Collection } = require("discord.js");
client.modalCollector = new Collection()

module.exports = {
	name: "interactionCreate",
	/**
	 *
	 * @param {ButtonInteraction} interaction
	 * @param {Client} client
	 * @returns
	 */
	async execute(interaction, client) {
		if(!interaction.isModalSubmit()) return;
    		let collector = client.modalCollector.get(interaction.message.id);
    		if(collector && collector instanceof Discord.Collector) collector.emit(`collect`, interaction);
	},
};
