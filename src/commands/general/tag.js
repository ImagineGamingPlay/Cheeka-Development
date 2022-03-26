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
        if (!query)
            return message.reply({embeds: [incorrectUsage]});
        if (query === "create") {
           
            await TagSchema.findOne({Name: query},async(err,tag)=>{
            if(err) return console.log(err);
            if(tag) return message.reply('Tag already exists!');
            const tagName = args[1]?.toLowerCase() ?? false;
            if(!tagName) return message.reply('Please specify a tag name!');
            const tagContent = args.slice(2).join(" ") ?? false;
            if(!tagContent) return message.reply('Please specify a tag content!');
            const newTag = new TagSchema({
                Name: tagName,
                Content: tagContent,
                UserId: message.author.id,
                CreatedAt: Date.now()
            });
            await newTag.save();
            return message.reply(`Tag **${tagName}** created!`);
            })
        } else if (query === "delete") {
            await TagSchema.findOne({Name: query},async(err,tag)=>{
            if(err) return console.log(err);
            if(!tag) return message.reply('Tag does not exist!');
            if(tag.UserId !== message.author.id) return message.reply('You cannot delete this tag!');
            await TagSchema.deleteOne({Name: query});
            return message.reply(`Tag **${query}** deleted!`);
            });
        } else if (query === "edit") {
            await TagSchema.findOne({Name: query},async(err,tag)=>{
            if(err) return console.log(err);
            if(!tag) return message.reply('Tag does not exist!');
            if(tag.UserId !== message.author.id) return message.reply('You cannot edit this tag!');
            const tagName = args[1]?.toLowerCase() ?? false;
            if(!tagName) return message.reply('Please specify a tag name!');
            const tagContent = args.slice(2).join(" ") ?? false;
            if(!tagContent) return message.reply('Please specify a tag content!');
            await TagSchema.updateOne({Name: query},{Name: tagName, Content: tagContent});
            return message.reply(`Tag **${query}** edited!`);
            });
        } else {
          message.reply("Couldnt find any valid tags by that name");
          return null;
        }
      });
    }
  },
};
