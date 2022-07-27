//Snipe Command
const { MessageEmbed, MessageButton, MessageActionRow, MessageAttachment, Modal, TextInputComponent } = require('discord.js');
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
		let snipes = client.snipes.get(channelId) ?? [],
		    eSnipe = client.eSnipe.get(channelId) ?? []
		// Check for the snipe in eSnipe
		let snipeEmbeds = snipes.map((snipe) => {
			let embed = new MessageEmbed()
			.setColor('#303136')
			.setTitle('Snipe')
			.setDescription(snipe.message.substring(0, 4095) || `\u200B`) //\u200B is an invisible character
			.addFields(
				{name: `Author`, value: `${snipe.author || `Unknown`}`, inline: true},
				{name: `Channel`, value: `<#${channelId}>`, inline: true},
				{name: `Time`, value: `<t:${Math.floor(snipe.time / 1000)}:R>`, inline: true}
			)
			.setThumbnail(snipe.author?.displayAvatarURL({dynamic: true}))
			let snipeFiles = snipe.attachments?.map(file => `[${file.name}](${file.url})`).join(`\n`)
			if(snipe.attachments?.size) embed.addField(
				`Attachment${snipe.attachments.size === 1 ? '' : 's'}`,
				snipeFiles.length > 1024 ? `Too many Attachment${snipe.attachments.size === 1 ? '' : 's'} to Display` : snipeFiles
      			)
			return embed
		})
		let eSnipeEmbeds = eSnipe.map((snipe) => {
			let snipeFilesBefore = snipe.before.attachments.map(file => `[${file.name}](${file.url})`).join(`\n`) || `\u200B`,
			    snipeFilesAfter = snipe.after.attachments.map(file => `[${file.name}](${file.url})`).join(`\n`) || `\u200B`
			return new MessageEmbed()
			.setColor('#303136')
			.setTitle('Edit Snipe')
			.addFields(
				{name: `Author`, value: `${snipe.author || `Unknown`}`, inline: true},
				{name: `Channel`, value: `<#${channelId}>`, inline: true},
				{name: `Time`, value: `<t:${Math.floor(snipe.time / 1000)}:R>`, inline: true},
				{name: `Content Before`, value: snipe.before.content.substring(0, 1023) || `\u200B`, inline: true},
				{name: `\u200B`, value: `\u200B`, inline: true}, //Blank Field
				{name: `Attachments Before`, value: snipeFilesBefore?.length > 1024 ? `Too many Attachment${snipe.attachments?.size === 1 ? '' : 's'} to Display` : snipeFilesBefore, inline: true},
				{name: `Content After`, value: snipe.after.content.substring(0, 1023) || `\u200B`, inline: true},
				{name: `\u200B`, value: `\u200B`, inline: true}, //Blank Field
				{name: `Attachments After`, value: snipeFilesAfter?.length > 1024 ? `Too many Attachment${snipe.attachments?.size === 1 ? '' : 's'} to Display` : snipeFilesAfter, inline: true}
			)
			.setThumbnail(snipe.author.displayAvatarURL({dynamic: true}))
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
      .setDisabled(snipes.length ? false : true),
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
			.setEmoji(`🗑️`),
			new MessageButton()
			.setStyle(`SECONDARY`)
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
    		let length = current.type === 'snipe' ? snipeEmbeds.length : eSnipeEmbeds.length
    		if(current.page + 1 === length || !length) [3, 4].forEach(n => rowNav.components[n].setDisabled(true))
		let msg = await message.channel.send({
			embeds: [
				snipeEmbeds[current.page] ?? embedNoSnipe
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
		client.modalCollector.set(msg.id, collector)
		collector.on(`collect`, async i => {
			if(i.customId === 'snipe_display') {
				let length = (current.type === 'snipe' ? snipeEmbeds : eSnipeEmbeds).length
				if(!length) return i.reply({ content: `There is nothing to search!`, ephemeral: true })
				let modal = new Modal()
				.setCustomId('snipe_page')
				.setTitle('Page')
				.addComponents(
				  	new MessageActionRow()
				  		.addComponents(
				    			new TextInputComponent()
						    .setCustomId('page_input')
						    .setLabel('Page')
						    .setPlaceholder(`Between 1 and ${length}`)
						    .setMinLength(1)
						    .setMaxLength(`${length}`.length)
						    .setRequired(true)
						    .setStyle('SHORT')
						  )
				)
				await i.showModal(modal)
		      	}
			else if(i.customId === (current.type === 'snipe' ? 'snipe_tosnipe' : 'snipe_toedit')) {
				let files = []
				if(current.type === `snipe`) {
					let snipe = snipes[current.page]
          if(!snipe) return i.reply({ content: 'There is nothing to view!', ephemeral: true })
					if(snipe.message) files.push(new MessageAttachment(Buffer.from(snipe.message, 'utf-8'), "content.txt"))
					if(snipe.attachments.size) files.push(new MessageAttachment(Buffer.from(
						snipe.attachments
							.map(file => `${file.name} - ${file.url}`)
							.join(`\n`),
						'utf-8'
					), "attachments.txt"))
				} else {
					let eSnip = eSnipe[current.page]
          if(!eSnip) return i.reply({ content: 'There is nothing to view!', ephemeral: true })
					if(eSnip.before.content) files.push(new MessageAttachment(Buffer.from(eSnip.before.content, 'utf-8'), "content-before.txt"))
					if(eSnip.before.attachments.size) files.push(new MessageAttachment(Buffer.from(
						eSnip.before.attachments
							.map(file => `${file.name} - ${file.url}`)
							.join(`\n`),
						'utf-8'
					), "attachments-before.txt"))
					if(eSnip.after.content) files.push(new MessageAttachment(Buffer.from(eSnip.after.content, 'utf-8'), "content-after.txt"))
					if(eSnip.after.attachments.size) files.push(new MessageAttachment(Buffer.from(
						eSnip.after.attachments
							.map(file => `${file.name} - ${file.url}`)
							.join(`\n`),
						'utf-8'
					), "attachments-after.txt"))
				}
				i.reply({ content: `Raw Message`, files, ephemeral: true })
			} else {
			        let toReturn = false
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
          				case `page`: {
            					let embeds = current.type === 'snipe' ? snipeEmbeds : eSnipeEmbeds
            					let page = i.fields.getTextInputValue('page_input')
           					if(!embeds[parseInt(page) - 1]) {
							await i.reply({ content: `**${page}** is not a valid page number!\nThe page number must be between 1 and ${embeds.length}!`, ephemeral: true })
							return toReturn = true
						}
						current.page = parseInt(page) - 1
						break
				  	}
				}
				if(toReturn) return
				let length = current.type === 'snipe' ? snipeEmbeds.length : eSnipeEmbeds.length
				if(current.page === 0) [0, 1].forEach(n => rowNav.components[n].setDisabled(true))
				else [0, 1].forEach(n => rowNav.components[n].setDisabled(false))
				if(current.page + 1 === length || !length) [3, 4].forEach(n => rowNav.components[n].setDisabled(true))
				else [3, 4].forEach(n => rowNav.components[n].setDisabled(false))
				rowSelect.components.forEach(button => button.setStyle('SECONDARY'))
				rowSelect.components[current.type === 'snipe' ? 0 : 1].setStyle('SUCCESS')
				rowNav.components[2].setLabel(`${current.page + 1}/${length}`)
				await i.update({
					embeds: [
						current.type === "snipe" ?
						snipeEmbeds[current.page] ?? embedNoSnipe :
						eSnipeEmbeds[current.page] ?? embedNoESnipe
					],
					components: [rowNav, rowSelect]
				})
			}
		})
		collector.on(`end`, () => {
      			client.modalCollector.delete(msg.id);
			[rowNav, rowSelect].forEach(row => row.components.forEach(button => button.setDisabled(true)))
			msg.edit({ components: [rowNav, rowSelect] }).catch(() => {})
		})
	},
};
