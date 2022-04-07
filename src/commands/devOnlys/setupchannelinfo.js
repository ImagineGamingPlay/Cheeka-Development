const Discord = require("discord.js");
const { MessageEmbed, Client, Message } = require("discord.js");
const { GuildData } = require("../../schema/guild");
const { guildCache } = require("../../utils/Cache");
const { google } = require("googleapis");
const service = google.youtube({ version: "v3", auth: process.env.yt_key });

module.exports = {
  name: "setupci",
  category: "owner",
  devCmd: true,
  description: "Set's up a channel information embed.",
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
    if (!channel) {
      return message.channel.send(
        "You need to provide a channel to set the embed to!"
      );
    }
    // Send a message to the channel
    let results = await service.channels.list({
      part: ["snippet", "statistics", "contentDetails"],
      id: "UCzBQ65qoUGqNPcbiNQN2pJA",
    });
    let result = results.data.items[0];
    let videos = await service.playlistItems.list({
      part: ["snippet", "status"],
      playlistId: result.contentDetails.relatedPlaylists.uploads,
    });
    let mesg = await channel.send({
      embeds: [
        new MessageEmbed()
          .setTitle("Channel Statistics")
          .addFields(
            {
              name: "Subscriber Count",
              value: result.statistics.subscriberCount,
            },
            {
              name: "View Count",
              value: result.statistics.viewCount,
              inline: true,
            },
            {
              name: "Video Count",
              value: result.statistics.videoCount,
              inline: true,
            },
            {
              name: "Last Uploaded Video",
              value: `[${videos.data.items[0].snippet.title}](https://www.youtube.com/watch?v=${videos.data.items[0].snippet.resourceId.videoId} "Watch the latest video!")`,
            }
          )
          .setColor("#2200ff")
          .setThumbnail(result.snippet.thumbnails.medium.url),
      ],
    });
    await GuildData.updateOne(
      {
        id: message.guild.id,
      },
      {
        id: message.guild.id,
        infoChannel: channel.id,
        infoMessage: mesg.id,
      },
      { upsert: true }
    );
    let guildA = guildCache.get(message.guild.id) || {
      id: message.guild.id,
    };
    guildA["infoChannel"] = channel.id;
    guildA["infoMessage"] = mesg.id;
    guildCache.set(message.guild.id, guildA);
  },
};
