//Snipe Command
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const CommandStructure = require('../../structure/CommandStructure').CommandStructure;
module.exports = {
	name: 'snipe',
	category: 'Moderation',
	description: 'Snipe a message.',
	devOnly: false,
	disabledChannel: [],
	guildOnly: true,
	deleteTrigger: true,
	/**
	 *
	 * @param {CommandStructure}
	 * @returns {Promise<*>}
	 */
	run: async ({ client, message, args }) => {
		//fetch the snipes
		// if(!config.devs.includes(message.author.id) || !message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("You don't have permission to use this command!");
		const channel =
			message.mentions?.channels?.first() ?? message.guild?.channels?.cache?.get(args[0]) ?? message.channel
		let channelId = channel.id
		let snipes = client.snipes.get(channelId),
		    eSnipe = client.eSnipe.get(channelId)
		// Check for the snipe in eSnipe
		let snipeEmbeds = snipes.map((snipe) => {
			let embed = new MessageEmbed()
			.setColor('#303136')
			.setTitle('Snipe')
			.setDescription(snipe.content.substring(0, 4095) || `\u200B`) //\u200B is an invisible character
			.addFields(
				{name: `Author`, value: `${snipe.author}`, inline: true},
				{name: `Channel`, value: `<#${channelId}>`, inline: true},
				{name: `Time`, value: `<t:${snipe.time}:R>`, inline: true}
			)
			.setImage(snipe.author.displayAvatarURL({dynamic: true}))
			let snipeFiles = snipe.attachments.map(file => `[${file.name}](${file.url})`).join(`\n`)
			if(snipe.attachments.size) embed.addField(
				`Attachment${snipe.attachments.size === 1 ? '' : 's'}`,
				snipeFiles.length > 1024 ? `Too many Attachment${snipe.attachments.size === 1 ? '' : 's'} to Display`
			)
			return embed
		})
		let eSnipeEmbeds = eSnipe.map((snipe) => {
			let snipeFilesBefore = snipe.before.attachments.map(file => `[${file.name}](${file.url})`).join(`\n`),
			    snipeFilesAfter = snipe.after.attachments.map(file => `[${file.name}](${file.url})`).join(`\n`)
			return new MessageEmbed()
			.setColor('#303136')
			.setTitle('Edit Snipe')
			.addFields(
				{name: `Author`, value: `${snipe.author}`, inline: true},
				{name: `Channel`, value: `<#${channelId}>`, inline: true},
				{name: `Time`, value: `<t:${snipe.time}:R>`, inline: true},
				{name: `Content Before`, value: snipe.before.content.substring(0, 1023) || `\u200B`, inline: true},
				{name: `\u200B`, value: `\u200B`, inline: true}, //Blank Field
				{name: `Attachments Before`, value: snipeFilesBefore.length > 1024 ? `Too many Attachment${snipe.attachments.size === 1 ? '' : 's'} to Display`, inline: true},
				{name: `Content After`, value: snipe.After.content.substring(0, 1023) || `\u200B`, inline: true},
				{name: `\u200B`, value: `\u200B`, inline: true}, //Blank Field
				{name: `Attachments After`, value: snipeFilesAfter.length > 1024 ? `Too many Attachment${snipe.attachments.size === 1 ? '' : 's'} to Display`, inline: true}
			)
			.setImage(snipe.author.displayAvatarURL({dynamic: true}))
		})
		let current = {
			type: "snipe",
			page: 0
		}
		let rowNav = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setStyle(`SECONDARY`)
			.setCustomId(`snipe_first`)
			.setEmoji(`⏪`)
			.setDisabled(true),
			new MessageButton()
			.setStyle(`SECONDARY`)
			.setCustomId(`snipe_before`)
			.setEmoji(`⬅️`)
			.setDisabled(true),
			new MessageButton()
			.setStyle(`PRIMARY`)
			.setCustomId(`snipe_display`)
			.setLabel(`${current.page + 1}/${snipeEmbeds.length}`)
			.setDisabled(true),
			new MessageButton()
			.setStyle(`SECONDARY`)
			.setCustomId(`snipe_after`)
			.setEmoji(`➡️`),
			new MessageButton()
			.setStyle(`SECONDARY`)
			.setCustomId(`snipe_last`)
			.setEmoji(`⏩`)
		)
		let rowSelect = new MessageActionRow()
		.addComponents(
			new MessageButton()
			.setStyle(`SUCCESS`)
			.setCustomId(`snipe_tosnipe`)
			.setLabel(`Snipe`)
			.setEmoji(`🗑️`)
			.setDisabled(true),
			new MessageButton()
			.setStyle(`SUCCESS`)
			.setCustomId(`snipe_toedit`)
			.setLabel(`Edit Snipe`)
			.setEmoji(`✏️`)
		)
		let embedNoSnipe = new MessageEmbed()
		.setColor(`RED`)
		.setTitle(`No Snipe`)
		.setDescription(`There is nothing to snipe in ${channel}`)
		let embedNoESnipe = new MessageEmbed()
		.setColor(`RED`)
		.setTitle(`No Edit Snipe`)
		.setDescription(`There is nothing to edit snipe in ${channel}`)
		let msg = await message.channel.send({
			embeds: [
				current.type = "snipe" ?
				snipeEmbeds[current.page] || embedNoSnipe :
				eSnipeEmbeds[current.page] || embedNoESnipe
			],
			components: [rowNav, rowSelect]
		})
		let collector = msg.createMessageComponentCollector({
			filter: (i) => {
				if(i.user.id === message.author.id) {
					collector.resetTimer()
					return true
				}
				i.reply({content: `This is not for you`, ephemeral: true})
			},
			time: 120000
		})
		collector.on(`collect`, async i => {
			switch(i.customId.split(`_`)[1]) {
				case `first`: {
					current.page = 0
					break
				}
				case `before`: {
					current.page--
					break
				}
				case `after`: {
					current.page++
					break
				}
				case `last`: {
					current.page = (current.type === 'snipe' ? snipeEmbeds.length : eSnipeEmbeds.length) - 1
					break
				}
				case `tosnipe`: {
					current.page = 0
					current.type = 'snipe'
					break
				}
				case `toedit`: {
					current.page = 0
					current.type = 'edit'
					break
				}
			}
			let length = current.type === 'snipe' ? snipeEmbeds.length : eSnipeEmbeds.length
			if(current.page === 0) [0, 1].forEach(n => rowNav.components[n].setDisabled(true))
			else [0, 1].forEach(n => rowNav.components[n].setDisabled(false))
			if(current.page + 1 === length || !length) [3, 4].forEach(n => rowNav.components[n].setDisabled(true))
			else [3, 4].forEach(n => rowNav.components[n].setDisabled(false))
			[0, 1].forEach(n => rowSelect.components[n].setDisabled(false).setStyle('SECONDARY'))
			if(current.type === 'snipe') rowSelect.components[0].setDisabled(true).setStyle('SUCCESS')
			else rowSelect.components[1].setDisabled(true).setStyle('SUCCESS')
			rowNav.components[2].setLabel(`${current.page + 1}/${length}`)
			i.update({
				embeds: [
					current.type = "snipe" ?
					snipeEmbeds[current.page] || embedNoSnipe :
					eSnipeEmbeds[current.page] || embedNoESnipe
				],
				components: [rowNav, rowSelect]
			})
		})
		collector.on(`end`, () => {
			[rowNav, rowSelect].forEach(row => row.components.forEach(button => button.setDisabled(true)))
			msg.edit({ components: [rowNav, rowSelect] })
		})
	},
};
