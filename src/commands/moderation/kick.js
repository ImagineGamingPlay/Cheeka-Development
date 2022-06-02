const CommandStructure = require('../../structure/CommandStructure').CommandStructure;
module.exports = {
	name: 'kick',
	description: 'Kicks a member',
	permissions: ['KICK_MEMBERS'],
	aliases: ['k'],
	category: 'Moderation',
	disabledChannel: [],
	deleteTrigger: true,
	/**
	 *
	 * @param {CommandStructure}
	 * @returns {Promise<*>}
	 */
	run: async ({ client, message, args }) => {
		try {
			let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
			if (!member) return message.reply('You need to mention someone to kick!');
			const reason = args.slice(1).join(' ');
			if (!reason) return message.reply('No reason was given');
			await member.send(`You were kicked of ${message.guild.name} for **${reason}**`);
			await member.kick();
			await message.reply(`${member.user.tag} was kicked!`);
		} catch (e) {
			await message.reply(`${e}`);
		}
	},
};
