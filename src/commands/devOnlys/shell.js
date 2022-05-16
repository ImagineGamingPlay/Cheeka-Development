const { exec } = require("child_process");
const { MessageEmbed } = require("discord.js");
const CommandStructure = require("../../structure/CommandStructure").CommandStructure;

module.exports = {
	name: "shell",
	description: "Execute shell commands from discord.",
	aliases: ["run"],
	disabledChannel: [],
	devOnly: true,
	category: "Owner",
	/**
	 *
	 * @param {CommandStructure}
	 * @returns {Promise<*>}
	 */
	run: async ({ client, message, args }) => {
		if (config.devs.includes(message.author.id)) {
			if (!__dirname.startsWith(`/root/fb/Cheeku/`))
				return message.reply("This command is not executable on the this device!");

			const command = args.join(" ");
			if (!command) return message.reply("Provide the shell command.");
			client.channels.cache.get("957276004114636842").send({
				embeds: [
					new MessageEmbed()
						.setTitle("New Shell!")
						.addField("Executor", `${message.author.tag} | ${message.author.id} | <@!${message.author.id}>`)
						.addField("Input", `\`\`\`js\n${command}\n\`\`\``),
				],
			});
			exec(command, async (err, stdout, stderr) => {
				if (err) return console.log(err);
				let res = stdout || stderr;
				message.channel.send({
					embeds: [
						new MessageEmbed()
							.setTitle("Shell")
							.setColor("AQUA")
							.setDescription(`\`\`\`js\n${res.slice(0, 2000)}\n\`\`\``),
					],
				});
			});
		} else return message.reply("Only the developers of cheeku can run this command.");
	},
};
