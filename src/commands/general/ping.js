const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Check for the bots latency",
  aliases: ["pong"],
  permissions: ["ADMINISTRATOR"],
  disabledChannel: [],
  category: "Administrator",
  cooldown: 8,
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    // create a time stamp with time and date
    const timeStamp = new Date().getTime();
    let loading = await message.reply("Calculating Ping...");
    let botPing = loading.createdTimestamp - timeStamp;
    let apiPing = client.ws.ping;

    let pingEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle(`:ping_pong: Ping Information`)
      .addFields(
        { name: "Bot's Ping", value: `${botPing}ms`, inline: true },
        { name: "API's latency", value: `${apiPing}ms`, inline: true },
        {
          name: "Bot's uptime",
          value: `${prettyMs(client.uptime)}`,
          inline: true,
        }
      )
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      });
    await loading.edit({ content: null, embeds: [pingEmbed] });
  },
};
