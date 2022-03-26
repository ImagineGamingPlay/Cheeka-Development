const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "purge",
  description: "clear a certain amount of messages",
  aliases: ["clear", "clr"],
  permissions: ["MANAGE_MESSAGES"],
  disabledChannel: [],
  category: "Moderation",
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
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
