const warningsSchema = require("../../schema/warnings");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "warnings-clear",
  description: "clear a member's warning history",
  aliases: ["warn-clear", "warn-clr"],
  permissions: ["KICK_MEMBERS"],
  run: async ({ client, message, args }) => {
    const target = message.mentions.members.first();
    const reason = args.slice(1).join(" ") || "No reason provided";

    if (!target) return message.reply("Please provide a user to clear warnings!");
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
  },
};
