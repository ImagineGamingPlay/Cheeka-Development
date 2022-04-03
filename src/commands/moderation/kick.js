module.exports = {
  name: "kick",
  description: "Kicks a member",
  permissions: ["KICK_MEMBERS"],
  aliases: ["k"],
  category: "Moderation",
  disabledChannel: [],
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    try {
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!member) return message.reply("You need to mention someone to kick!");
      const reason = args.slice(1).join(" ");
      if (!reason) return message.reply("No reason was given");
      await member.send(
        `You were kicked of ${message.guild.name} for **${reason}**`
      );
      await member.kick();
      await message.reply(`${member.user.tag} was kicked!`);
    } catch (e) {
      await message.reply(`${e}`);
    }
  },
};
