const { exec } = require("child_process");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "shell",
  description: "Execute shell commands from discord.",
  aliases: ["run"],
  disabledChannel: [],
  devCmd: true,
  category: "Owner",
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    if (config.devs.includes(message.author.id)) {
      if (!__dirname.startsWith(`/root/fb/Cheeku/`))
        return message.reply(
          "This command is not executable on the this device!"
        );

      const command = args.join(" ");
      if (!command) return message.reply("Provide the shell command.");
      client.channels.cache.get("957276004114636842").send({
        embeds: [
          new MessageEmbed()
            .setTitle("New Shell!")
            .addField(
              "Executor",
              `${message.author.tag} | ${message.author.id} | <@!${message.author.id}>`
            )
            .addField("Input", `\`\`\`js\n${command}\n\`\`\``),
        ],
      });
      exec(command, async (err, res) => {
        if (err) return console.log(err);
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Shell")
              .setColor("AQUA")
              .setDescription(`\`\`\`js\n${res.slice(0, 2000)}\n\`\`\``),
          ],
        });
      });
    } else
      return message.reply(
        "Only the developers of cheeku can run this command."
      );
  },
};
