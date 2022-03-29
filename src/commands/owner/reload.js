const { MessageEmbed } = require("discord.js");
const path = require("path");
const exec = require("child_process").exec;
const fs = require("fs");

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
            .setTitle("Stopped!")
            .setDescription("The bot has finally completed stopped.")
            .setColor("RED")
            .setFooter({
              text: "The bot shall be back within 10-20 seconds.",
            }),
        ],
      });
      // Create a temporary file called "restart.txt" and write the message id, message channel, guild channel to it
      const file = path.join(__dirname, "../../../restart.txt");
      // id, channel id, guild id and current time must be written to the file
      let data = `${msg.id},${msg.channel.id},${msg.guild.id},${Date.now()}`;
      fs.writeFileSync(file, data);
      exec("pkill -f -SIGHUP nodemon");
    }, 10000);
  },
};
