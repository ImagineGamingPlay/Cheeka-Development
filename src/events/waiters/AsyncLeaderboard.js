const { guildCache, userCache } = require("../../utils/Cache");
const { MessageEmbed } = require("discord.js");

module.exports = {
  // Time will be in milliseconds, run this every 1 minute
  time: 60000,
  run: async function (client) {
    // go through each guilds in cache
    Array.from(guildCache.values()).forEach(async (guild) => {
      if (!guild.leaderboardChannel) return;
      let channel = await client.channels
        .fetch(guild?.leaderboardChannel)
        .catch((error) => {
          console.log(error);
        });
      let message = await channel.messages
        .fetch(guild?.leaderboardMessage)
        .catch((error) => console.log(error));
      // Loop over userCache.values() and get the top 10
      let top10 = Array.from(userCache.values())
        .sort((a, b) => b.thanks - a.thanks)
        .slice(0, 10);
      // If top 10 is empty, then set it to ??? with 0 Thanks
      if (top10.length === 0) {
        await message?.edit({
          embeds: [
            new MessageEmbed()
              .setTitle("Thanks Leaderboard")
              .setDescription(
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                  .map((i) => `**#${i}.** ??? with \`0\` Thanks.`)
                  .join("\n")
              )
              .setColor("#32a852"),
          ],
        });
      }
      // Get the top person's id and fetch them
      let topUser = await client.users.fetch(top10[0].id);
      await message?.edit({
        embeds: [
          new MessageEmbed()
            .setTitle("Thanks Leaderboard")
            // Map top10 to the format of .map((i) => `**#${i}.** ??? with b Thanks.` where i is the index+1 and b is data.thanks, if the data is not enough for 10 people then replace all left once with **#index**. ??? with `0` thanks.
            .setDescription(
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                .map((i) => {
                  if (top10[i - 1]) {
                    return `**#${i}.** <@!${top10[i - 1].id}> with \`${
                      top10[i - 1].thanks
                    }\` Thanks.`;
                  } else {
                    return `**#${i}.** ??? with \`0\` Thanks.`;
                  }
                })
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
