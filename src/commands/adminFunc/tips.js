const {
	Permissions,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} = require("discord.js");
const { Types } = require("mongoose");
const tipSchema = require("../../schema/tips");

module.exports = {
	name: "tips",
	description: "edit a tip to the database",
	aliases: ["tip"],
	category: "admin",
	usage: "addtip <tip>",
	permissions: [Permissions.FLAGS.ADMINISTRATOR],
	run: async ({ client, message, args }) => {
		const method = args[0];

		if (
			!method ||
			!["add", "create", "list", "delete", "remove", "del"].includes(method)
		) {
			return message.reply({
				embeds: [
					{
						title: "Invalid Method!",
						description:
							"Please specify a valid method to edit a tip! Your valid options are Add, List or Remove",
						color: client.config.colors.error,
					},
				],
			});
		}

		if (method === "add") {
			const tip = args.slice(1).join(" ");
			if (!tip) {
				return message.reply("Please mention the tip you want to add!")
			}
			tipSchema.findOne(
				{
					tip: tip,
				},
				async (err, data) => {
					if (err) throw err;
					if (!data) {
						data = new tipSchema({
							tip: tip,
							authorId: message.author.id,
						});
						message.reply({
							embeds: [
								{
									title: "Tip Added!",
									description: `Your tip \`${tip}\` has been added!`,
									color: client.config.colors.success,
								},
							],
						});
					} else {
						return message
							.reply("That tip already exists!")
							.then(msg => setTimeout(() => msg.delete(), 5000));
					}
					data.save();
				}
			);
		} else if (method === "list") {
			let tips = [];
			tipSchema.find({}, async (err, data) => {
				if (err) throw err;
				if (data) {
					tips = data.map(obj => obj.tip);
				}
				message.reply({
					embeds: [
						{
							title: "Tips",
							author: {
								name: message.author.tag,
								icon_url: message.author.displayAvatarURL({ dynamic: true }),
							},
							description: `${data
								.map(
									t =>
										`**Tip:** ${t.tip}\n**Tip ID:** ${
											t._id
										}\n**Author:** ${message.guild.members.cache.get(
											t.authorId
										)} | ||${t.authorId}||\n\n`
								)
								.join(" ")}`,
							color: client.config.colors.primary,
						},
					],
				});
			});
		} else if ((method === "delete", "remove", "del")) {
			const tipId = args[1];
			module.exports.tipId = tipId;
			if (!tipId) {
				return message.reply({
					embeds: [
						{
							title: "Invalid Tip ID!",
							description: "Please specify a valid tip ID to delete!",
							color: client.config.colors.error,
						},
					],
				});
			}

			if (!Types.ObjectId.isValid(tipId)) {
				return client.config.errEmbed(
					message,
					"Tip not found!",
					"That tip does not exist! Please check the tip ID and try again."
				);
			}
			// await tipSchema
			// 	.findOne({ _id: tipId })
			// 	.then(data => {
			// 		if (!data) {
			// 			return client.config.errEmbed(
			// 				"Tip Not Found!",
			// 				"That tip does not exist!"
			// 			);
			// 		}
			// 	})
			// 	.catch(err => {
			// 		client.config.handleError(message, err);
			// 	});

			message.reply({
				embeds: [
					{
						title: "Are you sure?",
						description: `Are you sure you want to delete the tip with the ID of \`${tipId}\`?`,
						color: client.config.colors.warning,
						fields: [
							{
								name: "Tip ID:",
								value: tipId,
							},
						],
					},
				],
				components: [
					new MessageActionRow().addComponents(
						new MessageButton()
							.setLabel("Yes")
							.setStyle("SUCCESS")
							.setCustomId("rm-yes"),

						new MessageButton()
							.setLabel("Cancel")
							.setStyle("SECONDARY")
							.setCustomId("rm-cancel")
					),
				],
			});
		}
	},
};
