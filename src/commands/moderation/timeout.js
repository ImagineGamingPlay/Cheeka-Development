const ms = require("ms");
module.exports = {
  name: "timeout",
  description: "Timeouts a member",
  aliases: ["tm", "tmout"],
  run: async ({ client, message, args }) => {
    try {
      if (
        !message.member.permissions.has("MODERATE_MEMBERS") ||
        !message.guild.me.permissions.has("MODERATE_MEMBERS")
      )
        return;
      let member = message.mentions.members.first();
      if (!member) await message.reply("No user was given.");
      const time = args[1];
      if (!time) await message.reply("No time was given");
      const reason = args.slice(2).join(" ");
      if (!reason) await message.reply("No reason was given");
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
      message.reply(`${e}`);
    }
  },
};