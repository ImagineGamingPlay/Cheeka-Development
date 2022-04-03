const warningsSchema = require("../../schema/warnings");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "warnings-remove",
  description: "remove a warning from a member",
  aliases: ["warn-remove", "warn-del"],
  permissions: ["KICK_MEMBERS"],
  run: async ({ client, message, args }) => {
    let warnId = args[1];
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    const reason = args.slice(2).join(" ") || "No reason provided";

    if (!warnId) message.reply("Please provide a warning ID to remove!");
    if (!target)
      return message.reply("Please provide a user to remove a warning!");

    if (isNaN(warnId) && warnId === "all") {
      if (!target)
        return message.reply("Please provide a user to clear warnings!");
      warningsSchema.findOne(
        {
          guild: message.guildId,
          userId: target.id,
          userTag: target.user.tag,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            await warningsSchema.findOneAndDelete({
              guild: message.guildId,
              userId: target.id,
              userTag: target.user.tag,
            });

            message.reply({
              embeds: [
                new MessageEmbed()
                  .setAuthor({
                    name: target.user.tag,
                    iconURL: target.displayAvatarURL({ dynamic: true }),
                  })
                  .setColor("BLURPLE")
                  .setTitle(`Warnings cleared!`)
                  .setFooter({
                    text: `executed by: ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    `All the warnings of ${target.user.username} has been cleared!\n\n**Target:** ${target.user.tag} | ||${target.id}||\n\n**Reason:** ${reason}`
                  ),
              ],
            });
          } else {
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
        }
      );
    } else if (!isNaN(warnId)) {
      warnId = args[1] - 1;
      warningsSchema.findOne(
        {
          guild: message.guildId,
          userId: target.id,
          userTag: target.user.tag,
        },
        async (err, data) => {
          if (err) throw err;
          if (data) {
            data.content.splice(warnId, 1);
            message.reply({
              embeds: [
                new MessageEmbed()
                  .setAuthor({
                    name: target.user.tag,
                    iconURL: target.displayAvatarURL({ dynamic: true }),
                  })
                  .setColor("BLURPLE")
                  .setTitle(`Warning removed!`)
                  .setFooter({
                    text: `executed by: ${message.author.tag}`,
                    iconURL: message.author.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    `**Target:** ${target.user.tag} | ||${
                      target.id
                    }||\n**Warn ID:** ${warnId + 1}\n\n**Reason:** ${reason}`
                  ),
              ],
            });
            data.save();
          } else {
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
        }
      );
    } else
      message.reply("Please provide a valid warning ID; `all` or a number!");
  },
};
