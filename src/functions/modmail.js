const modmailSchema = require("../schema/modmail");
const fs = require("fs");
const { MessageEmbed, Permissions, MessageAttachment } = require("discord.js");
const { FLAGS } = Permissions;
const { tagsCache } = require("../utils/Cache");
const { config } = require("dotenv");
const fun = require("../events/messageCreate");

client.on("messageCreate", async message => {
	// <------------- MODMAIL ------------->
	if (message.author?.bot) return; // If the author is bot, do nothing
	const user = client.users.cache.get(message.channel.topic);

	const guild = await client.guilds.cache.get("952514062904860692"); // Getting the server
	const category = "963369858752479273"; // Modmail category
	const logsChannel = guild.channels.cache.get("963370258989719582"); // modmail_logs channel

	if (message.channel.type === "DM") {
		checkAndSave(message); // calling the function which checks if the message has an attachment

		const checking = !!guild.channels.cache.find(
			c => c.topic === message.author.id // Getting the modmail channel via it's topic which consists of userId
		);
		if (checking === true) {
			//if the channel already exists we'll send the message
			const mailChannel = await guild.channels.cache.find(
				ch => ch.topic === message.author.id
			);

			if (message.attachments && message.content === "") {
				message.react("✅");
				// if message contains attachment and no content
				mailChannel.send({
					embeds: [
						new MessageEmbed()
							.setAuthor({
								name: message.author.tag,
								iconURL: message.author.displayAvatarURL({ dynamic: true }),
							})
							.setColor("GREEN")
							.setImage(message.attachments.first().proxyURL)
							.setTimestamp(),
					],
				});
			} else {
				// if message contains content and no attachment
				message.react("✅");
				mailChannel.send({
					embeds: [
						new MessageEmbed()
							.setAuthor({
								name: message.author.tag,
								iconURL: message.author.displayAvatarURL({ dynamic: true }),
							})
							.setColor("GREEN")
							.setDescription(message.content)
							.setTimestamp(),
					],
				});
			}
		} else {
			// if the channel doesn't exist, we will create a new one
			message.reply({
				// replying to the dm with a message
				embeds: [
					new MessageEmbed()
						.setTitle("Modmail has been created")
						.setDescription(
							`Please wait for a staff member to join the thread to start your conversation`
						)
						.setColor("BLURPLE")
						.setFooter({
							text: "Please have a valid reason to create modmai thread",
						})
						.setTimestamp(),
				],
			});
			const mailChannel = await guild.channels.create(
				// creating the modmail thread
				message.author.username,
				{
					type: "GUILD_TEXT",
					topic: message.author.id,
					parent: category,
					permissionOverwrites: [
						{
							id: guild.id,
							deny: [FLAGS.VIEW_CHANNEL],
						},
					],
				}
			);
			mailChannel.send({
				// sending a startup message to the modmail thread
				embeds: [
					new MessageEmbed()
						.setColor("BLURPLE")
						.setTitle("New Modmail Thread")
						.setDescription(
							`A new modmail thread has been created.\n**Creator:** ${message.author.tag} | ||${message.author.id}||\n**Created At:** ${message.createdAt}`
						)
						.setFooter({
							text: "Use -mmguide to get info about modmail commands",
						}),
				],
			});

			logsChannel.send({
				// sending the log
				embeds: [
					new MessageEmbed()
						.setDescription(
							`**${message.author.tag}** has created a modmail thread!\n**Thread:** ${mailChannel}`
						)
						.setColor("BLURPLE"),
				],
			});

			if (message.attachments && message.content === "") {
				message.react("✅");
				mailChannel.send({
					embeds: [
						new MessageEmbed()
							.setAuthor({
								name: message.author.tag,
								iconURL: message.author.displayAvatarURL({ dynamic: true }),
							})
							.setColor("GREEN")
							.setImage(message.attachments.first().proxyURL)
							.setTimestamp(),
					],
				});
			} else {
				message.react("✅");
				mailChannel.send({
					embeds: [
						new MessageEmbed()
							.setAuthor({
								name: message.author.tag,
								iconURL: message.author.displayAvatarURL({ dynamic: true }),
							})
							.setColor("GREEN")
							.setDescription(message.content)
							.setTimestamp(),
					],
				});
			}
		}
	}
	if (!message.guild) return; // if message is not in guild, return
	if (
		message.guild.id === guild.id &&
		message.channel.parentId === category // checking if the message is in a modmail thread
	) {
		if (message.content === "-" + "close") {
			// Command to close the thread
			message.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("Deleting thread in 5 seconds...")
						.setColor("RED"),
				],
			});

			setTimeout(() => {
				client.users.cache.get(message.channel.topic).send({
					// sending a message to the user that the thread was deleted
					embeds: [
						new MessageEmbed()
							.setTitle("Thread Deleted!")
							.setDescription(
								`Hey buddy! Your modmail thread has been deleted from ${message.guild.name}!\n\n
                    **Modmail ID:** ${message.channel.topic}\n
                    **Deleted By:** ${message.author.tag}`
							)
							.setColor("RED")
							.setFooter({
								text: "If you have any queries, simply dm the bot again!",
							}),
					],
				});

				sendTranscriptAndDelete(message, logsChannel); // working on this thing
				message.channel
					.delete([`modmail thread delete. Action by: ${message.author.tag}`]) // deleting channel with reason
					.then(ch => {
						guild.channels.cache.get("963370258989719582").send({
							// sending a log
							embeds: [
								new MessageEmbed()
									.setTitle("Modmail Thread Deleted")
									.setDescription(
										`**Thread Name:** ${ch.name}\n
                  **Modmail ID:** ${ch.topic}\n
                  **Deleted By:** ${message.author.tag}
                  **Thread Owner:** ${client.users.cache.get(ch.topic)} | ||${
											ch.topic
										}||`
									)
									.setColor("RED"),
							],
						});
					});
			}, 5000);
			return;
		} else if (message.content.startsWith("//")) {
			return; // if message starts with $ we are not gonna send the message (in order to let the staffs discuss)
		} else if (
			message.content.startsWith("{") &&
			message.content.slice(-1) === "}"
		) {
			const query = message.content.slice(1, -1);
			const tag = tagsCache.get(query);
			if (!tag) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle("Invalid Usage!")
							.setDescription(
								"The tag you provided is not in the database, please check the tag name."
							),
					],
				});
			}

			if (tag.guild !== message.guild.id) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle("Invalid Usage!")
							.setDescription(
								"The tag you provided is not in this server, please try again."
							),
					],
				});
			}
			if (!tag.enabled) {
				return message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle("Invalid Usage!")
							.setDescription(
								"The tag isn't verified by a moderator yet and not ready for use."
							),
					],
				});
			}
			// If the tag is in the database, return the content of the tag
			return user
				.send({
					allowedMentions: [{ repliedUser: false, everyone: false }],
					embeds: [
						new MessageEmbed()
							.setAuthor({
								name: message.guild.name,
								iconURL: message.guild.iconURL(),
							})
							.setColor("GREEN")
							.setDescription(tag.content)
							.setTimestamp(),
					],
				})
				.then(
					message.reply({
						embeds: [
							new MessageEmbed()
								.setColor("GREEN")
								.setTitle("Tag Sent!")
								.setDescription(
									`Tag sent to ${user.tag}\n\n**Tag Content:**\n${tag.content}`
								),
						],
					})
				);
		}

		modmailSchema.findOne(
			// code to send reply of mods to the user
			{ authorId: message.channel.topic },
			async (err, data) => {
				if (err) throw err;
				if (data) {
					if (message.attachment && message.content === "") {
						data.content.push(
							`${message.author.tag}: ${message.attachments.first().proxyURL}`
						);
					} else {
						data.content.push(`${message.author.tag}: ${message.content}`);
					}
					data.save();
				}
			}
		);

		if (message.attachments && message.content === "") {
			message.react("✅");
			user.send({
				embeds: [
					new MessageEmbed()
						.setAuthor({
							name: message.author.tag,
							iconURL: message.author.displayAvatarURL({ dynamic: true }),
						})
						.setColor("GREEN")
						.setImage(message.attachments.first().proxyURL)
						.setTimestamp(),
				],
			});
		} else {
			message.react("✅");
			user.send({
				embeds: [
					new MessageEmbed()
						.setAuthor({
							name: message.guild.name,
							iconURL: message.guild.iconURL({ dynamic: true }),
						})
						.setColor("GREEN")
						.setDescription(message.content)
						.setTimestamp(),
				],
			});
		}
	}
});

function checkAndSave(message) {
	modmailSchema.findOne(
		{
			authorId: message.author.id,
		},
		async (err, data) => {
			if (err) throw err;
			if (data) {
				if (message.attachments && message.content === "") {
					data.content.push(
						`${message.author.tag} : ${message.attachments.first().proxyURL}`
					);
				} else {
					data.content.push(`${message.author.tag} : ${message.content}`);
				}
			} else {
				if (message.attachments && message.content === "") {
					data = new modmailSchema({
						authorId: message.author.id,
						content: `${message.author.tag} : ${
							message.attachments.first().proxyURL
						}`,
					});
				} else {
					data = new modmailSchema({
						authorId: message.author.id,
						content: `${message.author.tag} : ${message.content}`,
					});
				}
			}

			data.save();
		}
	);
}

async function sendTranscriptAndDelete(message, channel) {
	modmailSchema.findOne(
		{
			authorId: message.channel.topic,
		},
		async (err, data) => {
			if (err) throw err;
			if (data) {
				// 	fs.writeFileSync(
				// 		`../${message.channel.topic}.txt`,
				// 		data.content.join("\n\n")
				// 	);
				// 	let transcriptFile = new MessageAttachment(
				// 		fs.createReadStream(`../${message.channel.topic}.txt`)
				// 	);
				// 	await channel.send({
				// 		files: [transcriptFile],
				// 	});
				// 	fs.unlinkSync(`../${message.channel.name}.txt`);
				// 	await modmailSchema.findOneAndDelete({
				// 		authorId: message.channel.topic,
				// 	});
			}
		}
	);
}
