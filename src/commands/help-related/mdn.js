const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'mdn',
	description: 'Search MDN for a given term.',
	category: 'Help',
	run: async ({ client, message, args }) => {
		const query = args.join(' ');
		if (!query) {
			return client.config.errEmbed(message, 'Missing Arugment!', 'Please provide an argument to search for!');
		}
		const URI = `https://developer.mozilla.org/api/v1/search?q=${encodeURIComponent(query)}&locale=en-US`;
		const documents = (await axios(URI)).data.documents;

		if (!documents) {
			return message.reply({
				embeds: [
					{
						title: `No results found for "${query}"`,
						color: 'RED',
						timestamp: new Date(),
					},
				],
			});
		}

		const mdnEmbed = new MessageEmbed()
			.setAuthor({
				name: 'MDN documentation',
				iconURL: 'https://avatars.githubusercontent.com/u/7565578?s=200&v=4',
			})
			.setColor('BLURPLE');

		let overflow = false;

		if (documents.length > 3) {
			documents.length = 3;
			overflow = true;
		}

		for (let { mdn_url, title, summary } of documents) {
			summary = summary.replace(/(\r\n|\n|\r)/gm, '');

			mdnEmbed.addField(title, `${summary}\n[**Link**](https://developer.mozilla.org/${mdn_url})`);
		}

		if (overflow) {
			mdnEmbed.addField(
				'Too many results!',
				`Visit more results [here!](https://developer.mozilla.org/en-US/search?q=${encodeURIComponent(query)})`
			);
		}

		message.reply({ embeds: [mdnEmbed] });
	},
};
