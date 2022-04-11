const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");

require("dotenv").config({
	path: path.resolve(__dirname, "../.env"),
});

const client = (global.client = new Client({
	intents: 32767,
	allowedMentions: { parse: ["users"] },
}));

client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

client.login(process.env.token);

/* Config Files (public) */
const c = (global.c = require("./jsons/channels.json"));
const config = (global.config = require("../config.json"));
module.exports = { client };

const handlers = ["commands", "events", "mongoose", "buttons", "selectMenus"];

for (const handler of handlers) {
	require(`./handlers/${handler}`);
}

process.on("unhandledRejection", (reason, p) => {
	let channel = client.channels.cache.get("958000637944164462");
	console.log(reason, p);
	channel?.send({
		embeds: [
			new MessageEmbed()
				.setTitle("Unhandled Rejection")
				.setDescription(`${reason}`)
				.setColor("RED")
				.addField("Stack", "```js\n" + reason.stack + "```"),
		],
	});
});
process.on("uncaughtException", (err, origin) => {
	let channel = client.channels.cache.get("958000637944164462");
	console.log(err, origin);
	channel?.send({
		embeds: [
			new MessageEmbed()
				.setTitle("Uncaught Exception")
				.setDescription(`${err}`)
				.setColor("RED")
				.addField("Stack", "```js\n" + err.stack + "```"),
		],
	});
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
	let channel = client.channels.cache.get("958000637944164462");
	console.log(err, origin);
	channel?.send({
		embeds: [
			new MessageEmbed()
				.setTitle("Uncaught Exception")
				.setDescription(`${err}`)
				.setColor("RED")
				.addField("Stack", "```js\n" + err.stack + "```"),
		],
	});
});
process.on("multipleResolves", (type, promise, reason) => {
	let channel = client.channels.cache.get("958000637944164462");
	console.log(type, promise, reason);
	channel.send({
		embeds: [
			new MessageEmbed()
				.setTitle("Multiple Resolves")
				.setDescription(`${type}`)
				.setColor("RED")
				.addField("Stack", "```js\n" + reason.stack + "```"),
		],
	});
});
