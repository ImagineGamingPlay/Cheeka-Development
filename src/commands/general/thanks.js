const { MessageEmbed } = require("discord.js");
const { thankCooldownCache, userCache } = require("../../utils/Cache");
const UserModel = require("../../schema/user");

module.exports = {
  name: "thanks",
  description: "Thank a user for their help!",
  aliases: ["thank", "ty"],
  permissions: [],
  category: "General",
  disabledChannel: [],
  cooldown: 5,
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    // Make sure someone is mentioend
    let user = message.mentions.members.first();
    if (!user) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "You need to mention someone to thank them for their help!"
            ),
        ],
      });
    }
    if (user.user.bot)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription("You can't thank bots!"),
        ],
      });
    // Make the user is not mentioning himself
    if (user.id === message.author.id)
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              "You can't thank yourself for your help! You can thank someone else though!"
            ),
        ],
      });

    // Make the user is not in cooldown
    let coolDown = thankCooldownCache.get(message.author.id);
    // coolDown is in milliseconds, we'll have to subtract the current time from it and convert it to minutes and check if it has been more than 45.
    if (Date.now() - coolDown > 0 && Date.now() - coolDown < 45 * 60 * 1000) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `You can only thank ${user.user.tag} once every 45 minutes!`
            ),
        ],
      });
    }
    // Set the user in cooldown
    thankCooldownCache.set(message.author.id, Date.now());
    // Get the mentioned user's thanks and add one to it
    let thanks = userCache.get(user.id) || {
      thanks: 0,
      id: user.id,
    };
    thanks.thanks++;
    userCache.set(user.id, thanks);
    // Upsert the user thanks
    await UserModel.updateOne(
      {
        id: user.id,
      },
      { id: user.id, thanks: thanks.thanks },
      { upsert: true }
    );
    message.reply({
      embeds: [
        new MessageEmbed().setDescription(
          `${user} now has ${thanks.thanks} thanks!`
        ),
      ],
    });
  },
};
