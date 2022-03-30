const { MessageEmbed } = require("discord.js");
const { cBlackListCache } = require("../../utils/Cache");
const { BlacklistChannel } = require("../../schema/blacklist");
module.exports = {
  name: "disablechannel",
  description: "Disable bot commands in a specific channel.",
  devCmd: true,
  disabledChannel: [],
  category: "Owner",
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    const query = args[0]?.toLowerCase();
    if (!query)
      return message.channel.send(
        "Please provide a query.\nAdd-> ['add','create'] \nRemove -> ['remove','delete']"
      );
    const channelId =
      message.mentions?.channels?.first()?.id ??
      message.guild?.channels?.cache?.get(args[1]) ??
      (await client.channels?.fetch(args[1]).then(async (channels) => {
        return channels?.id;
      }));
    if (!channelId)
      return message.channel.send("Please provide a valid user to blacklist!");

    if (query === "add" || query === "create") {
      await BlacklistChannel.findOne(
        { channelId: channelId },
        async (error, data) => {
          if (error) return null;
          if (data) {
            await message.reply({
              embeds: [
                new MessageEmbed({
                  title: " Channel Already Blacklisted.",
                  description: `<#${channelId}> is already blacklisted form using any commands.`,
                  color: "GOLD",
                }),
              ],
            });
          } else {
            await new BlacklistChannel({
              channelId: channelId,
            }).save();
            cBlackListCache.set(channelId, true);
            await message.reply("✅ Channel successfully blacklisted.");
            return data;
          }
        }
      );
    } else if (query === "remove" || query === "delete") {
      await BlacklistChannel.findOneAndDelete(
        { channelId: channelId },
        async (error, data) => {
          if (error) return null;
          if (data) {
            await message.reply("✅ Channel successfully un-blacklisted.");
            return data;
          } else {
            await message.reply("❌ Channel is not blacklisted!!");
          }
        }
      );
    } else {
      return message.reply("Invalid query.");
    }
  },
};
