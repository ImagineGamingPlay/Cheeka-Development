const { MessageEmbed } = require("discord.js");
const CommandStructure =
  require("../../structure/CommandStructure").CommandStructure;
module.exports = {
  name: "purge",
  description: "clear a certain amount of messages",
  aliases: ["clear", "clr"],
  permissions: ["MANAGE_MESSAGES"],
  disabledChannel: [],
  category: "Moderation",
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({ client, message, args }) => {
    const amount = args[0];

    if (amount > 100)
      return message.reply(
        "You cannnot delete more than 100 messages at once!"
      );
    if (isNaN(amount))
      return message.reply("Invalid amount given, amount must be a number!");
    try {
      await message.channel.bulkDelete(amount, true);
      await message.channel.bulkDelete(1);
      message.channel
        .send({
          embeds: [
            new MessageEmbed()
              .setTitle(`🧹 Successfully deleted ${amount} messages!`)
              .setColor("BLURPLE"),
          ],
        })
        .then((msg) => {
          setTimeout(() => msg.delete(), 5000);
        });
    } catch (err) {
      return;
      /*
            console.log(err);
            await message.reply(`\`\`\`${err}\`\`\``);
             */
    }
  },
};
