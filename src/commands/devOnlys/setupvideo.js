const Discord = require("discord.js");
const { MessageEmbed, Client, Message } = require("discord.js");
const { GuildData } = require("../../schema/guild");
const { guildCache } = require("../../utils/Cache");

module.exports = {
  name: "setupvid",
  category: "owner",
  devCmd: true,
  description: "Set's up a new video notifier channel and role.",
  disabledChannel: [],
  category: "Owner",
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @returns {Promise<*>} Returns a promise that might return anything
   * @param args {Array} A array of the arguments passed to the command
   */
  run: async ({ client, message, args }) => {
    const notowner = new MessageEmbed()
      .setDescription("Only the developers of cheeku can use this command!")
      .setColor("DARK_ORANGE");

    if (!config.devs.includes(message.author.id))
      return message.channel.send({ embeds: [notowner] });
    // Make sure a channel is provided
    let channel = message.mentions.channels.first();
    let role = message.mentions.roles.first();
    if (!channel) {
      return message.channel.send(
        "You need to provide a channel to set the notifier to!"
      );
    }
    // Send a message to the channel
    await GuildData.updateOne(
      {
        id: message.guild.id,
      },
      {
        id: message.guild.id,
        videoChannel: channel.id,
        videoRole: role?.id || null,
      },
      { upsert: true }
    );
    let guildA = guildCache.get(message.guild.id) || {
      id: message.guild.id,
    };
    guildA["videoChannel"] = channel.id;
    guildA["videoRole"] = role?.id || null;
    guildCache.set(message.guild.id, guildA);
    // Reply the message saying "Done, I've settuped the video channel!"
    message.channel.send(
      `Done, I've settuped the video channel to ${channel}!`
    );
  },
};
