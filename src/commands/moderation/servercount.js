const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "servercount",
  description: "view the number of servers the bot is in, and their names.",
  aliases: ["sc"],
  permission: ["SEND_MESSAGES"],
  disabledChannel: [],
  category: "Moderation",
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    const guilds = [];
    client.guilds.cache.forEach((guild) => {
      guilds.push(guild.name);
    });
    const a = new MessageEmbed()
      .setAuthor({
        name: "Servers i'm in",
        iconURL: client.user.displayAvatarURL(),
      })
      .setDescription(guilds.join("\n"))
      .setFooter({
        text: `Currently in ${client.guilds.cache.size} servers.`,
      });
    await message.reply({ embeds: [a] });
  },
};
