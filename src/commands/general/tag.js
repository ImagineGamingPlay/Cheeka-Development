const TagSchema = require("../../schema/tags.js");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "tag",
  description: "Tag system in modified form.",
  aliases: ["t"],
  disabledChannel: [],
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    let incorrectUsage = new MessageEmbed()
      .setAuthor({
        name: "Incorrect Usage!",
        iconURL: client.user.displayAvatarURL(),
      })
      .setColor("#ff0000")
      .setDescription(`Please specify a tag name, or use **create**, **edit** or **delete**.
    `);

    const query = args[0]?.toLowerCase() ?? false;
    if (!query) return message.reply({ embeds: [incorrectUsage] });
    if (query === "create") {
      //will be added soon
    } else if (query === "delete") {
      //add basic from cheekus current code?
    } else if (query === "edit") {
      //this part will be done after create and delete
    } else {
      await TagSchema.findOne({ Name: query }, async (error, data) => {
        if (data.Code) {
          await message.reply({
            content: `${data.Code}`,
            allowedMentions: [{ repliedUser: false, everyone: false }],
          });
          return null;
        } else {
          message.reply("Couldnt find any valid tags by that name");
          return null;
        }
      });
    }
  },
};
