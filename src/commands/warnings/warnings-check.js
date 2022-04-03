const { MessageEmbed } = require("discord.js");
const warningsSchema = require("../../schema/warnings");

module.exports = {
  name: "warnings-check",
  description: "check for a member's warning history",
  aliases: ["warn-check"],
  permissions: ["KICK_MEMBERS"],
  category: "Moderation",
  run: async ({ client, message, args }) => {
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);

    if (!target)
      message.reply("Please mention a user to check their warnings!");

    warningsSchema.findOne(
      {
        guild: message.guildId,
        userId: target.id,
        userTag: target.user.tag,
      },
      async (err, data) => {
        if (err) throw err;
        if (data) {
          message.reply({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: target.user.tag,
                  iconURL: target.displayAvatarURL({ dynamic: true }),
                })
                .setColor("BLURPLE")
                .setTitle(`Warnings history`)
                .setFooter({
                  text: `executed by: ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                  `${data.content
                    .map(
                      (c, i) =>
                        `**Warn ID:** ${i + 1}\n**Warned by:** ${
                          c.executerTag
                        }\n**Date:** ${c.date}\n**Reason:** ${c.reason}\n\n`
                    )
                    .join(" ")}`
                ),
            ],
          });
        } else
          message.reply({
            embeds: [
              new MessageEmbed()
                .setAuthor({
                  name: target.user.tag,
                  iconURL: target.displayAvatarURL({ dynamic: true }),
                })
                .setColor("BLURPLE")
                .setTitle(`No warnings found for this user`)
                .setFooter({
                  text: `executed by: ${message.author.tag}`,
                  iconURL: message.author.displayAvatarURL({ dynamic: true }),
                }),
            ],
          });
      }
    );
  },
};
