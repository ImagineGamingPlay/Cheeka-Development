module.exports = {
  name: "mod-nick",
  description: "Change a user's nickname",
  aliases: ["modnick", "moderate-nick", "moderate-nick"],
  category: "Moderation",
  permissions: ["MANAGE_NICKNAMES"],
  /**
   * @param {CommandStructure} message
   * @param {string} args
   * @returns {(Promise<Message|boolean>)}
   */
  run: async ({ client, message, args }) => {
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!target) {
      return message.reply("Please mention a user or provide a user ID");
    }

    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let nickname = "";

    for (let i = 0; i < 5; i++) {
      const ran = Math.floor(Math.random() * characters.length);
      nickname += characters.substring(ran, ran + 1);
    }

    target.setNickname(`Moderated nickname ${nickname}`, [
      `Moderated nickname triggered by ${message.author.tag}`,
    ]);
  },
};
