const TagSchema = require("../../schema/tags.js");
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { tagsCache } = require("../../utils/Cache.js");
const { devs } = require("../../../config.json");

module.exports = {
  name: "tag",
  description: "Tag system in modified form.",
  aliases: ["t"],
  category: "General",
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
      let tagA = tagsCache.get(args[1]);
      if (tagA) {
        if (!tagA.enabled) {
          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setTitle("Invalid Usage!")
                .setDescription(
                  "This tag is submitted for verification, if the verification gets denied you can try to re-create the tag."
                ),
            ],
          });
        }
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
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Tag submitted!")
            .setDescription(
              `The tag **${args[1]}** has been created & submitted for verification.`
            ),
        ],
      });
      // If the tagName is not in the database, create a new tag with the tagName and content
      let tag = await TagSchema.create({
        name: args[1],
        content: args.slice(2).join(" "),
        owner: message.author.id,
        createdAt: new Date().toISOString(),
        guild: message.guild.id,
        enabled: false,
      });
      let id = tag._id.valueOf();
      client.channels.fetch("958056394630787115").then((channel) => {
        let messageEmbed = new MessageEmbed()
          .setTitle("New Tag Submission")
          // Set description as the content
          .setDescription(
            tag.content > 2048 ? tag.content.slice(0, 2048) : tag.content
          )
          .setColor("GOLD")
          .addField("Tag Name", tag.name)
          .addField("Tag ID", id)
          .addField("Guild", message.guild.name)
          .addField("Owner", message.author.toString());
        channel.send({
          embeds: [messageEmbed],
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setCustomId("a-" + id)
                .setLabel("Accept")
                .setStyle("SUCCESS"),
              new MessageButton()
                .setCustomId("d-" + id)
                .setLabel("Deny")
                .setStyle("DANGER")
            ),
          ],
        });
      });
      // add to the cache
      return tagsCache.set(args[1], {
        name: args[1],
        content: args.slice(2).join(" "),
        owner: message.author.id,
        createdAt: new Date().toISOString(),
        guild: message.guild.id,
        enabled: false,
        _id: tag._id,
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
      if (!delTag || !delTag.enabled) {
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

      if (delTag.guild !== message.guild.id) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("Invalid Usage!")
              .setDescription(
                "The tag you provided is not in this server, please try again."
              ),
          ],
        });
      }
      if (
        message.member.permissions.has("MANAGE_MESSAGES") ||
        devs.includes(message.member.id)
      ) {
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
      if (!(await TagSchema.findOne({ name: args[1], enabled: true }).exec())) {
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
          guild: message.guild.id,
          enabled: true,
        }).exec()
      ) {
        // edit from cache
        tagsCache.set(args[1], {
          name: args[1],
          content: args.slice(2).join(" "),
          owner: message.author.id,
          createdAt: new Date().toISOString(),
          guild: message.guild.id,
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

    if (tag.guild !== message.guild.id) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Invalid Usage!")
            .setDescription(
              "The tag you provided is not in this server, please try again."
            ),
        ],
      });
    }
    if (!tag.enabled) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setTitle("Invalid Usage!")
            .setDescription(
              "The tag isn't verified by a moderator yet and not ready for use."
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
          .addField("Creation date", `\`${tag.createdAt}\``)
          .addField("Verified at", `\`${tag.verifiedAt}\``)
          .addField("Verified by", `<@!${tag.verifiedBy}>`),
      ],
    });
  },
};
