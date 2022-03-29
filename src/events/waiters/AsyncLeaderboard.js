const { guildCache, userCache } = require("../../utils/Cache");
const { MessageEmbed } = require("discord.js");

module.exports = {
  // Time will be in milliseconds, run this every 1 minute
  time: 60000,
  run: async function (client) {
    // go through each guilds in cache
    Array.from(guildCache.values()).forEach(async (guild) => {
      if (!guild.leaderboardChannel) return;
      let channel = await client.channels.fetch(guild?.leaderboardChannel).catch((error) => {console.log(error)});
      let message = await channel.messages.fetch(guild?.leaderboardMessage).catch((error) => console.log(error));
      // Loop over userCache.values() and get the top 10
      let top10 = Array.from(userCache.values())
        .sort((a, b) => b.thanks - a.thanks)
        .slice(0, 10);
      // Get the top person's id and fetch them
      let topUser = await client.users.fetch(top10[0].id);
      await message.edit({
        embeds: [
          new MessageEmbed()
            .setTitle("Thanks Leaderboard")
            // Map top10 to the format of .map((i) => `**#${i}.** ??? with b Thanks.` where i is the index+1 and b is data.thanks
            .setDescription(
              top10
                .map(
                  (i, index) =>
                    `**#${index + 1}.** <@!${i.id}> with \`${
                      i.thanks
                    }\` Thanks.`
                )
                .join("\n")
            )
            .setColor("#32a852")
            // Set the thumbnail of the leading
            .setThumbnail(topUser.displayAvatarURL())
            // Set the footer to Leading: topUser.username
            .setFooter({
              text: `Leading: ${topUser.username}`,
            }),
        ],
      });
    });
  },
};
