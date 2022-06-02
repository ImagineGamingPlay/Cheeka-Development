const { MessageEmbed } = require('discord.js');
const CommandStructure = require('../../structure/CommandStructure').CommandStructure;
module.exports = {
	name: 'purge',
	description: 'clear a certain amount of messages',
	aliases: ['clear', 'clr', 'prg'],
	permissions: ['MANAGE_MESSAGES'],
	disabledChannel: [],
	category: 'Moderation',
	deleteTrigger: true,
	/**
	 *
	 * @param {CommandStructure}
	 * @returns {Promise<*>}
	 */
	run: async ({ client, message, args }) => {
		const query = args[0];

		if (query > 100) {
			return message.reply('You cannnot delete more than 100 messages at once!');
		}
		if (isNaN(query)) {
			return message.reply('Invalid amount given, amount must be a number!');
		}
		try {
			const amount = parseInt(query);
			const fetched = await message.channel.messages.fetch({
				limit: amount + 1,
			});

			await message.channel.bulkDelete(fetched, true).then(
				message.channel
					.send({
						embeds: [
							{
								color: 'GREEN',
								title: `:broom: Successfully deleted ${amount} messages!`,
							},
						],
					})
					.then((msg) => {
						setTimeout(() => {
							msg.delete();
						}, 3000);
					})
			);
		} catch (error) {
			console.log(error);
		}
	},
	// try {
	//   await message.channel.bulkDelete(amount, true);
	//   await message.channel.bulkDelete(1);
	//   message.channel
	//     .send({
	//       embeds: [
	//         new MessageEmbed()
	//           .setTitle(`🧹 Successfully deleted ${amount} messages!`)
	//           .setColor("BLURPLE"),
	//       ],
	//     })
	//     .then((msg) => {
	//       setTimeout(() => msg.delete(), 5000);
	//     });
	// } catch (err) {
	//   return;
	// }
};
