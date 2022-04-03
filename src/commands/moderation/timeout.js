const ms = require("ms");
module.exports = {
  name: "timeout",
  description: "Timeouts a member",
  aliases: ["tm", "tmout"],
  disabledChannel: [],
  category: "Moderation",
  permissions: ["KICK_MEMBERS"],
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    try {
      if (
        !message.member.permissions.has("MODERATE_MEMBERS") ||
        !message.guild.me.permissions.has("MODERATE_MEMBERS")
      )
        return;
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!member) return await message.reply("No user was given.");
      const time = args[1];
      if (!time) return await message.reply("No time was given");
      const reason = args.slice(2).join(" ");
      if (!reason) return await message.reply("No reason was given");
      let ttime = ms(time);
      if (ttime === undefined)
        await message.reply(
          "Please make sure the syntax is correct: .timeout <@user> <time> <reason>"
        );
      await member.send(
        `You were timed out for **${time}** for doing **${reason}**`
      );
      await member.timeout(ttime);
      await message.reply(
        `**${member.user.tag}** got timed out for **${time}** for doing **${reason}**`
      );
    } catch (e) {
      return await message.reply(`${e}`);
    }
  },
};
