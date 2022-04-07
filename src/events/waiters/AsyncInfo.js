const { guildCache } = require("../../utils/Cache");
const { MessageEmbed } = require("discord.js");
const { google } = require("googleapis");
const service = google.youtube({ version: "v3", auth: process.env.yt_key });

module.exports = {
  // Time will be in milliseconds, run this every 1 minute
  time: 60000,
  run: async function (client) {
    Array.from(guildCache.values()).forEach(async (guild) => {
      if (!guild.infoChannel) return;
      let channel = await client.channels
        .fetch(guild?.infoChannel)
        .catch((error) => {
          console.log(error);
        });
      let message = await channel.messages
        .fetch(guild?.infoMessage)
        .catch((error) => console.log(error));
      let results = await service.channels.list({
        part: ["snippet", "statistics", "contentDetails"],
        id: "UCzBQ65qoUGqNPcbiNQN2pJA",
      });
      let result = results.data.items[0];
      let videos = await service.playlistItems.list({
        part: ["snippet", "status"],
        playlistId: result.contentDetails.relatedPlaylists.uploads,
      });
      await message?.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Channel Statistics")
            .addFields(
              {
                name: "Subscriber Count",
                value: result.statistics.subscriberCount,
              },
              {
                value: result.statistics.viewCount,
                inline: true,
                name: "View Count",
              },
              {
                name: "Video Count",
                value: result.statistics.videoCount,
                inline: true,
              },
              { name: "Last Uploaded Video", value: videos.data.items[0] }
            )
            .setColor("#2200ff")
            .setThumbnail(result.snippet.thumbnails.medium.url),
        ],
      });
    });
  },
};
