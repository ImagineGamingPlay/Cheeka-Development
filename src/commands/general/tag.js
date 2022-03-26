const TagSchema = require("../../schema/tags.js");
const { MessageEmbed } = require("discord.js");
const { tagsCache } = require("../../utils/Cache.js");

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
    // Make sure a arg is provided
    if (!args[0]) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Invalid Usage!")
            .setDescription(
              "Please use the following format!\n `tag <tagName/create/delete/edit> [tagName] [content]`"
            ),
        ],
      });
    }

    // If the arg[0] is create, make sure that tagName and content as arguments are provided, content can be more than 1 string so make sure to join them
    if (args[0] === "create") {
      if (!args[1] || !args[2]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "Please use the following format!\n `tag <tagName/create/delete/edit> [tagName] [content]`"
              ),
          ],
        });
      }
      // If the tagName is already in the database, return an error
      let tagA = await TagSchema.findOne({
        name: args[1],
      }).exec();
      if (tagA) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "The tag name you provided is already in use, please choose another name."
              ),
          ],
        });
      }
      // If the tagName is not in the database, create a new tag with the tagName and content
      TagSchema.create({
        name: args[1],
        content: args.slice(2).join(" "),
        owner: message.author.id,
        createdAt: new Date().toISOString(),
      });
      // add to the cache
      tagsCache.set(args[1], {
        name: args[1],
        content: args.slice(2).join(" "),
        owner: message.author.id,
        createdAt: new Date().toISOString(),
      });
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Tag Created!")
            .setDescription(`The tag **${args[1]}** has been created.`),
        ],
      });
    }

    // If the arg[0] is delete, make sure that tagName is provided and make sure that tag is owned by the same person, if the person has permission to MANAGE_MESSAGES then allow him to delete the tag wherether not he is the tag owner or not. Use cache find to find the tag and delete it. Using message.member.permissions.has([Permissions.FLAGS.MANAGE_MESSAGES]) check if the user is a mod
    if (args[0] === "delete") {
      if (!args[1]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "Please use the following format!\n `tag <tagName/create/delete/edit> [tagName] [content]`"
              ),
          ],
        });
      }
      let delTag = tagsCache.get(args[1]);
      if (!delTag) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "The tag you provided does not exist, please try again."
              ),
          ],
        });
      }
      if (message.member.permissions.has("MANAGE_MESSAGES")) {
        TagSchema.deleteOne({
          name: args[1],
        }).exec();
        tagsCache.delete(args[1]);
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Tag Deleted!")
              .setDescription(`The tag **${args[1]}** has been deleted.`),
          ],
        });
      }
      if (delTag.owner !== message.author.id) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "You are not the owner of this tag, please try again."
              ),
          ],
        });
      }
      TagSchema.deleteOne({
        name: args[1],
      }).exec();
      tagsCache.delete(args[1]);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Tag Deleted!")
            .setDescription(`The tag **${args[1]}** has been deleted.`),
        ],
      });
    }

    // if args[0] is edit, make sure that tagName and content are provided, content can be more than 1 string so make sure to join them, Please verify that the tag is owned by the same person, if the person has permission to MANAGE_MESSAGES then allow him to edit the tag wherether not he is the tag owner or not
    if (args[0] === "edit") {
      if (!args[1] || !args[2]) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "Please use the following format!\n `tag <tagName/create/delete/edit> [tagName] [content]`"
              ),
          ],
        });
      }
      // If the tag is not in the database, return an error
      if (!(await TagSchema.findOne({ name: args[1] }).exec())) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "The tag you provided is not in the database, please check the tag name."
              ),
          ],
        });
      }
      // If the tag is in the database, check if the tag is owned by the same person, if the person has permission to MANAGE_MESSAGES then allow him to edit the tag wherether not he is the tag owner or not
      if (
        await TagSchema.findOne({
          name: args[1],
          owner: message.author.id,
        }).exec()
      ) {
        // edit from cache
        tagsCache.set(args[1], {
          name: args[1],
          content: args.slice(2).join(" "),
          owner: message.author.id,
          createdAt: new Date().toISOString(),
        });
        await TagSchema.updateOne(
          { name: args[1] },
          {
            $set: {
              content: args.slice(2).join(" "),
            },
          }
        ).exec();
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Tag Edited!")
              .setDescription(`The tag **${args[1]}** has been edited.`),
          ],
        });
      } else {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "You don't have permission to edit this tag, please contact the owner of the tag."
              ),
          ],
        });
      }
    }

    // So if non of these arguments are satisified fetch the tag through the cache that is a map
    const tag = tagsCache.get(args[0]);
    if (!tag) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Invalid Usage!")
            .setDescription(
              "The tag you provided is not in the database, please check the tag name."
            ),
        ],
      });
    }
    // If the tag is in the database, return the content of the tag
    return message.reply({
      allowedMentions: [{ repliedUser: false, everyone: false }],
      embeds: [
        new MessageEmbed()
          .setTitle("Tag Info")
          .addField("Name", `\`${tag.name}\``)
          .addField("Tag Creator", `<@!${tag.owner}>`)
          .addField("Creation date", `\`${tag.createdAt}\``),
      ],
    });
  },
};
