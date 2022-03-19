const TagSchema = require("../../schema/tags.js");
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: "tag",
  description: "Tag system in modified form.",
  aliases: ["t"],
  run: async ({ client, message, args }) => {
    let incorrectUsage = new MessageEmbed()
    .setAuthor('Incorrect Tag Cmd Usage!', client.user.displayAvatarURL())
    .setColor('RED')
    .setDescription(`Please specify a tag name, or use **create**, **edit** or **delete**.
    `)
    
    const query = args[0]?.toLowerCase() ?? false;
    if (!query)
      return message.reply(incorrectUsage);
    if (query === "create") {
      //will be added soon
    } else if (query === "delete") {
      //add basic from cheekus current code?
    } else if (query === "edit") {
      //this part will be done after create and delete
    } else {
      await TagSchema.findOne({ Name: query }, async (error, data) => {
        if (error) console.log(error);
        if (data) {
          message.reply({
            content: `${data.Code}`,
            allowedMentions: [{ repliedUser: false, everyone: false }],
          });
        } else {
          return message.reply("Couldnt find any valid tags by that name");
        }
      });
    }
  },
};
