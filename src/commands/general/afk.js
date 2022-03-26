const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");
const { afkUsers } = require("../../utils/Cache");

module.exports = {
  name: "afk",
  description: "Marks you away from keyboard.",
  aliases: ["away"],
  permissions: [],
  disabledChannel: [],
  cooldown: 30,
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    // Make sure the user is not already afk
    if (afkUsers.has(message.user.id)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("You are already afk!"),
        ],
      });
    }
    // Check if the user has provided a reason, it can be more than one word but must be less than 50
    let reason = args.slice(1).join(" ");
    if (reason === "") reason = "No reason provided.";
    if (reason.length > 50) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "Your reason is too long! You can only provide 50 characters!"
            ),
        ],
      });
    }
    // Set the user as afk
    afkUsers.set(message.user.id, {
      reason,
      username: message.user.username,
    });
    // Modify the user's username and set it to [AFK] $username, if the total length of the username exceeds 32, cut the username to 32 characters by removing ends
    message.user.setUsername(
      `[AFK] ${
        message.user.username.length > 32
          ? message.user.username.slice(0, 32)
          : message.user.username
      }`
    );
  },
};
