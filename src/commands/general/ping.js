const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Check for the bots latency",
  aliases: ["pong"],
  permissions: ["ADMINSTRATOR"],
  cooldown: 8,
  run: async ({ client, message, args }) => {
    let result = await message.reply("Calculating Ping...");
    let botPing = result.createdTimestamp - message.createdTimestamp;
    let apiPing = client.ws.ping;

    let pingEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle(":ping_pong: Ping Information")
      .addFields(
        { name: "Bot's Ping", value: `${botPing}ms`, inline: true },
        { name: "API's latency", value: `${apiPing}ms`, inline: true },
        { name: "Bot's uptime", value: `${prettyMs(client.uptime)}`, inline: true },
      )
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      });

    await result.edit({ content: "** **", embeds: [pingEmbed] });
  },
};
