const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "mmguide",
	description: "Shows the modmail Guide",
	aliases: ["modmailguide", "modmail-guide", "modmail"],
	category: "help-related",
	usage: "",
	/**
	 *
	 * @param {CommandStructure}
	 * @returns {Promise<*>}
	 */
	run: async ({ client, message, args }) => {
		const embed = new MessageEmbed()
			.setColor("BLURPLE")
			.setTitle("Modmail Guide")
			.setThumbnail(message.guild.iconURL({ dynamic: true }))
			.setDescription(
				`This guide will help you get started with Modmail. Please the the following properly before attempting to assist a modmail thread.\n`
			)
			.addFields(
				{
					name: "Basics",
					value:
						"To get started, look for some channels in the `modmail` category. If you see any, first read the chat history and see if someone else is assisting the user. Please donot try to assist a thread if there's already someone doing it. But if the thread hasn't been replied from a long time, (ex. 3, 4 hours) then you can take over the thread assuming the previous assistor hasn't told the user to wait. Also, please don't share your identity of who you are. If you are asked, you can simply say `I am a modmail staff from IGP's Coding Villa. How may I assist you?`. Another thing, **Donot erase or edit the channel's topic which contain's the user's id.** With all those in mind, you are basically ready to help some users in the thread",
				},
				{
					name: "Basic commands",
					value:
						"You can close the thread with `-close`\nUsing `//` infront of the message will prevent it from being sent to the user. Comes handly when you want to discuss with other staffs.",
				}
			);

		message.reply({ embeds: [embed] });
	},
};
