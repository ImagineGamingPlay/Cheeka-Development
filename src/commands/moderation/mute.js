const { MessageEmbed } = require('discord.js');
const CommandStructure = require('../../structure/CommandStructure').CommandStructure;
// Create a function that takes string (1d3h3m6s) as an argument and returns a number of milliseconds
const ms = (s) => {
	const units = [
		{ name: 'd', amount: 86400000 },
		{ name: 'h', amount: 3600000 },
		{ name: 'm', amount: 60000 },
		{ name: 's', amount: 1000 },
	];
	let total = 0;
	for (const unit of units) {
		const regex = new RegExp(`(\\d+)${unit.name}`);
		const match = s.match(regex);
		if (match) {
			total += parseInt(match[1]) * unit.amount;
		}
	}
	return total;
};

const humanize = require('pretty-ms');

const { MutesModel } = require('../../schema/mutes');
module.exports = {
	name: 'mute',
	description: 'Mute a member',
	permissions: ['MANAGE_MESSAGES'],
	aliases: ['m'],
	category: 'Moderation',
	disabledChannel: [],
	deleteTrigger: true,
	/**
	 *
	 * @param {CommandStructure}
	 * @returns {Promise<*>}
	 */
	run: async ({ client, message, args }) => {
		const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
		if (!member) {
			return message.channel.send({
				embeds: [new MessageEmbed().setColor('RED').setDescription(`You need to mention a member to mute!`)],
			});
		}
		args.shift();
		let duration = null;
		let reason = 'No reason provided';
		if (args.length > 0) {
			if (ms(args[0]) > 0) {
				duration = ms(args[0]);
				args.shift();
			}
			if (args.length > 0) {
				reason = args.join(' ');
			}
		}
		if (!member.kickable) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(`I can't mute this member because I don't have the permissions to do so!`),
				],
			});
		}

		if (member.id === message.author.id) {
			return message.channel.send({
				embeds: [new MessageEmbed().setColor('RED').setDescription(`You can't mute yourself!`)],
			});
		}
		// Make sure that the user doesn't already have Muted role
		if (member.roles.cache.some((r) => r.name === 'Muted')) {
			return message.channel.send({
				embeds: [new MessageEmbed().setColor('RED').setDescription(`This member is already muted!`)],
			});
		}

		const embed = new MessageEmbed()
			.setColor('RED')
			.setDescription(`${member.user.tag} has been muted from **${message.guild.name}**`)
			.addField('Reason', reason)
			.addField('Moderator', message.author.tag)
			.addField('Duration', duration ? humanize(duration) : 'Permanent')
			.setAuthor({
				name: message.guild.name,
				iconURL: message.guild.iconURL(),
			})
			.setTimestamp();
		await member
			.send({
				embeds: [embed],
			})
			.catch(() => {});

		// Now add mute role to the member
		const muteRole = (await message.guild.roles.fetch()).find((r) => r.name === 'Muted');
		if (!muteRole) {
			return message.channel.send({
				embeds: [
					new MessageEmbed()
						.setColor('RED')
						.setDescription(`No mute role found! Please create a role called \`Muted\` and assign it to the bot.`),
				],
			});
		}

		await member.roles.add(muteRole);
		await message.reply({
			embeds: [embed],
		});
		// Add user to the muted table
		MutesModel.create({
			id: member.id,
			guild: message.guild.id,
			moderator: message.author.id,
			reason: reason,
			active: true,
			role: muteRole.id,
			unmuteOn: duration ? duration + Date.now() : null,
		});
	},
};
