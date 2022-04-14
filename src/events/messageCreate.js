const { prefix, devs } = require("../../config.json");
const modmailSchema = require("../schema/modmail");
const { Collection, MessageEmbed, Permissions } = require("discord.js");
const { FLAGS } = Permissions;
//Create cooldowns map
const cooldowns = new Map();
//Blacklist system
const {
	blackListCache,
	cBlackListCache,
	afkUsers,
	tagsCache,
} = require("../utils/Cache");
module.exports = {
	name: "messageCreate",
	/**
	 * @param message {Message}
	 * @param client {Client}
	 * @returns {Promise<*>}
	 */
	async execute(message, client) {
		// Prefix is a list of prefixes as a array. Check if the message starts with any of the prefixes
		let rPrefix = prefix.reduce((acc, cur) => {
			if (message.content.startsWith(cur)) acc.push(cur);
			return acc;
		}, [])[0];
		// <------------- MODMAIL ------------->
		if (message.author?.bot) return; // If the author is bot, do nothing

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
			if (message.content === rPrefix + "close") {
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
								**Thread Owner:** ${client.users.cache.get(ch.topic)} | ||${ch.topic}||`
										)
										.setColor("RED"),
								],
							});
						});
					sendTranscriptAndDelete(message, logsChannel); // working on this thing
				}, 5000);
				return;
			} else if (message.content.startsWith("//")) return; // if message starts with $ we are not gonna send the message (in order to let the staffs discuss)

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

			const user = client.users.cache.get(message.channel.topic);

			if (message.attachments && message.content === "") {
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
		// <------------- MODMAIL  END ------------->
		if (
			message.channel.id === "745283907670245406" ||
			message.channel.id === "802783156281016340"
		) {
			const EMOJIREGEX =
				/((?<!\\)<:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu;
			let emojies = message.content.match(EMOJIREGEX);
			if (emojies) {
				emojies.forEach(a => {
					if (a.startsWith("<")) {
						message.react(a.slice(2, -1));
					} else {
						message.react(a);
					}
				});
			}
		}
		if (afkUsers.has(message.author.id)) {
			// Get the user's previous username
			let user = afkUsers.get(message.author.id);
			// Set the user's username back to their previous username
			try {
				await message.member.setNickname(user.username);
			} catch (ignored) {}
			// Remove the user from the afkUsers map
			afkUsers.delete(message.author.id);
			// Reply to the user that they are no longer afk
			message.reply({
				embeds: [new MessageEmbed().setColor("GREEN").setTitle("AFK Removed!")],
			});
		}
		if (!message.author?.bot) {
			message.mentions.members.forEach(user => {
				if (afkUsers.has(user.id)) {
					let userA = afkUsers.get(user.id);
					message.reply({
						embeds: [
							new MessageEmbed()
								.setColor("RANDOM")
								.setTitle(`User AFK`)
								.addField("User", user.user.tag, false)
								.addField("Reason", userA.reason, false),
						],
					});
				}
			});
		}
		if (
			message.author?.bot ||
			!message.guild ||
			!message.content.startsWith(rPrefix)
		)
			return;

		const args = message.content.slice(rPrefix.length).trim().split(" ");
		const cmd = args.shift().toLowerCase();
		const command =
			client.commands.get(cmd) ||
			client.commands.find(a => a.aliases && a.aliases.includes(cmd));

		if (!command) {
			// Check if a tag exists for the similar
			let a = tagsCache.get(
				message.content.slice(rPrefix.length).split(" ")[0]
			);
			if (a && a.enabled) {
				// Reply witgith the content
				await message.reply({
					content: a.content,
					allowedMentions: [{ repliedUser: false, everyone: false }],
				});
			}
			return;
		}
		//Blacklist here
		const data = blackListCache.get(message.author?.id);
		const blacklistedChannel = cBlackListCache.get(message.channel.id);
		if (blacklistedChannel) {
			let a = await message.reply(
				"You are not allowed to use commands in this channel!"
			);
			setTimeout(() => {
				a.delete();
				message.delete().catch(() => {});
			}, 5000);
			return;
		}
		if (!data) {
			//Normal code but placed in the  block
			//Cooldown system
			/**
			 * @type string[]
			 */
			if (command.disabledChannel) {
				// Make sure that the command is not disabled in the channel
				if (command.disabledChannel.includes(message.channel.id)) {
					let a = await message.reply(
						"This command is disabled in this channel!"
					);
					setTimeout(() => {
						a.delete();
						message.delete().catch(() => {});
					}, 5000);
					return;
				}
			}
			if (command.cooldown) {
				//If cooldowns map doesn't have a command.name key then create one.
				if (!cooldowns.has(command.name)) {
					cooldowns.set(command.name, new Collection());
				}

				const current_time = Date.now();
				const time_stamps = cooldowns.get(command.name);
				const cooldown_amount = command.cooldown * 1000;

				//If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
				if (time_stamps.has(message.author.id)) {
					const expiration_time =
						time_stamps.get(message.author.id) + cooldown_amount;

					if (current_time < expiration_time) {
						const time_left = (expiration_time - current_time) / 1000;

						return message.reply(
							`Please wait ${time_left.toFixed(1)} more seconds before using ${
								command.name
							}`
						);
					}
				}

				//If the author's id is not in time_stamps then add them with the current time.
				time_stamps.set(message.author.id, current_time);
				//Delete the user's id once the cooldown is over.
				setTimeout(
					() => time_stamps.delete(message.author.id),
					cooldown_amount
				);
			}
			//Ends of cooldown system
			const member = message.member;

			if (command.devCmd && !devs.includes(member.id)) {
				return message.reply("This command can only be used by developers!");
			}

			if (command.permissions && command.permissions.length > 0) {
				if (!member.permissions.has(command.permissions))
					if (!devs.includes(member.id))
						return message.reply(
							"You don't have the required permissions to use this command!"
						);
			}
			if (command.guildOnly && !message.guild)
				return message.reply("This command can only be used in a guild!");

			try {
				await command.run({ client, message, args });
			} catch (err) {
				console.log(err);
			}
		} else {
			return message.reply(
				"Sorry you are blacklisted form running the commands."
			);
		}
	},
};

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
				// fs.writeFileSync(
				// 	`../${message.channel.topic}.txt`,
				// 	data.content.join("\n\n")
				// );
				// await channel.send({
				// 	files: [
				// 		{
				// 			attachment: new MessageAttachment(
				// 				fs.createReadStream(`../${message.channel.topic}.txt`)
				// 			),
				// 		},
				// 	],
				// });
				// fs.unlinkSync(`../${message.channel.name}.txt`);
				// await modmailSchema.findOneAndDelete({
				// 	authorId: message.channel.topic,
				// });
			}
		}
	);
}
