const { guildCache } = require("../../utils/Cache");
const { MessageEmbed } = require("discord.js");
const {google} = require('googleapis')
const service = google.youtube({ version: 'v3', auth: "Google API Key" });

module.exports = {
  // Time will be in milliseconds, run this every 1 minute
  time: 60000,
  run: async function (client) {
    Array.from(guildCache.values()).forEach(async (guild) => {
      if(!guild.videoChannel) return;
      let channel = await client.channels
        .fetch(guild?.videoChannel)
        .catch((error) => {
          console.log(error);
        });
      let results = await service.channels.list({
        part: ['snippet', 'statistics', 'contentDetails'],
        id: 'UCzBQ65qoUGqNPcbiNQN2pJA'
      })
      let result = results.data.items[0]
      let videos = await service.playlistItems.list({
        part: ['snippet', 'status'],
        playlistId: result.contentDetails.relatedPlaylists.uploads
      })
      let content = "Imagine just uploaded a video!\n" + videos.data.items[0]
      if(guild.videoRole) content = guild.videoRole.toString() + content
      await channel?.send({
        content: content
      })
    })
  },
};
