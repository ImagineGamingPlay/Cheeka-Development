const { BansModel } = require("../../schema/bans");
const { MutesModel } = require("../../schema/mutes");
const { MessageEmbed } = require("discord.js");

const client = require("../../index").client;

module.exports = {
  // Time will be in milliseconds, run this every 1 minute
  time: 30000,
  /**
   *
   * @param {client} client
   */
  run: async function (client) {
    // Find all bans and mutes that are active and have time less than current date
    const bans = await BansModel.find({
      active: true,
      unbanOn: { $lt: Date.now() },
    });
    const mutes = await MutesModel.find({
      active: true,
      unmuteOn: { $lt: Date.now() },
    });
    // Unban all users
    for (const ban of bans) {
      client.guilds.cache.get(ban.guild).members.unban(ban.id, "Ban expired.");
      await BansModel.findOneAndUpdate({ id: ban.id }, { active: false });
    }
    // Unmute all users
    for (const mute of mutes) {
      // Fetch every user that is muted
      client.guilds.cache
        .get(mute.guild)
        .members.fetch(mute.id)
        .then(async (member) => {
          // Unmute the user
          await member.roles.remove(mute.role);
          // Update the mute to inactive
          await MutesModel.findOneAndUpdate({ id: mute.id }, { active: false });
          // Send message to the user
          member.send({
            embeds: [
              new MessageEmbed()
                .setColor("GREEN")
                .setDescription(
                  `Your mute has expired! You're able to talk again!`
                ),
            ],
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  },
};
