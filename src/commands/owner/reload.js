const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const path = require("path");
const exec = require("child_process").exec;

module.exports = {
  name: "reload",
  category: "Owner",
  devCmd: true,
  description: "Reload all the events and commands.",
  aliases: ["reloadall", "restart"],
  disabledChannel: [],
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    let msg = await message.channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle("Restarting...")
          .setDescription("The bot is now restarting.")
          .setColor("ORANGE"),
      ],
    });
    setTimeout(async () => {
      await msg.edit({
        embeds: [
          new MessageEmbed()
            .setTitle("Restarted!")
            .setDescription("The bot has been restarted.")
            .setColor("GREEN"),
        ],
      });
      exec("pkill -f -SIGHUP nodemon");
    }, 10000);
  },
};
