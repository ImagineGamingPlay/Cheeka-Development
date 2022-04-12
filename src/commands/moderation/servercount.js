const { MessageEmbed } = require("discord.js");
const CommandStructure =
  require("../../structure/CommandStructure").CommandStructure;
module.exports = {
  name: "servercount",
  description: "view the number of servers the bot is in, and their names.",
  aliases: ["sc"],
  permission: ["SEND_MESSAGES"],
  disabledChannel: [],
  category: "Moderation",
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
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
