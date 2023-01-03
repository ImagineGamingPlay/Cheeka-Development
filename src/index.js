const { Client, Collection, MessageEmbed, WebhookClient } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { description } = require('./commands/adminFunc/tips');

require('dotenv').config({
	path: path.resolve(__dirname, '../.env'),
});

const client = (global.client = new Client({
	intents: 32767,
	allowedMentions: { parse: ['users'] },
	partials: ['CHANNEL'],
}));

client.config = {
	colors: {
		primary: '#5865F2', // blurple
		success: '#2ECC71', // green
		error: '#E74C3C', // red
		warning: '#E67E22', // orange
	},
	errEmbed: (message, title, description) => {
		return message.reply({
			embeds: [
				{
					title: title,
					description: description,
					color: client.config.colors.error,
				},
			],
		});
	},
	handleError: (error, message) => {
		return client.config.errEmbed(
			message,
			'Error!',
			`An error has occured, please try again later.\n\n**Error: **\`\`\`js\n${error}\`\`\``
		);
	},
};

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

client.login(process.env.token);

/* Config Files (public) */
const c = (global.c = require('./jsons/channels.json'));
const config = (global.config = require('../config.json'));
module.exports = { client };
const handlerFiles = ['selectMenus', 'buttons', 'mongoose', 'commands', 'events'];
const functionFiles = ['modmail', 'tip'];

for (const file of handlerFiles) {
	require(`./handlers/${file}`);
}
for (const file of functionFiles) {
	require(`./functions/${file}`);
}

/* Error Logging */
const errorLogger = new WebhookClient({
            url: config.errorLogWebhookURL,
        })
process.on('unhandledRejection', (reason, p) => {
	if (reason?.message === 'The request is missing a valid API key.') return;
	console.log(reason, p);
	errorLogger?.send({
		embeds: [
			new MessageEmbed()
				.setTitle('Unhandled Rejection')
				.setDescription(`${reason}`)
				.setColor('RED')
				.addField('Stack', '```js\n' + reason.stack + '```'),
		],
	});
});
process.on('uncaughtException', (err, origin) => {
	console.log(err, origin);
	errorLogger?.send({
		embeds: [
			new MessageEmbed()
				.setTitle('Uncaught Exception')
				.setDescription(`${err}`)
				.setColor('RED')
				.addField('Stack', '```js\n' + err.stack + '```'),
		],
	});
});
process.on('uncaughtExceptionMonitor', (err, origin) => {
	console.log(err, origin);
	errorLogger?.send({
		embeds: [
			new MessageEmbed()
				.setTitle('Uncaught Exception')
				.setDescription(`${err}`)
				.setColor('RED')
				.addField('Stack', '```js\n' + err.stack + '```'),
		],
	});
});
process.on('multipleResolves', (type, promise, reason) => {
	console.log(type, promise, reason);
	errorLogger?.send({
		embeds: [
			new MessageEmbed()
				.setTitle('Multiple Resolves')
				.setDescription(`${type}`)
				.setColor('RED')
				.addField('Stack', '```js\n' + reason.stack + '```'),
		],
	});
});