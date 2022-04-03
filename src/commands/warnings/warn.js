const { MessageEmbed } = require("discord.js");
const warningsSchema = require("../../schema/warnings");

module.exports = {
  name: "warn",
  description: "warn a member",
  permissions: ["KICK_MEMBERS"],
  category: "Moderation",
  run: async ({ client, message, args }) => {
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(" ") || "No reason provided";
    const warnDate = new Date(message.createdTimestamp).toLocaleDateString();

    if (!target) return message.reply("Please provide a user to warn");

    warningsSchema.findOne(
      {
        guild: message.guildId,
        userId: target.id,
        userTag: target.user.tag,
      },
      async (err, data) => {
        if (err) throw err;
        if (!data) {
          data = new warningsSchema({
            guild: message.guildId,
            userId: target.id,
            userTag: target.user.tag,
            content: [
              {
                executerId: message.author.id,
                executerTag: message.author.tag,
                reason: reason,
                date: warnDate,
              },
            ],
          });
        } else {
          const dataObj = {
            executerId: message.author.id,
            executerTag: message.author.tag,
            reason: reason,
            date: warnDate,
          };
          data.content.push(dataObj);
        }
        data.save();
      }
    );

    message.reply({
      embeds: [
        new MessageEmbed()
          .setAuthor({
            name: target.user.tag,
            iconURL: target.displayAvatarURL({ dynamic: true }),
          })
          .setColor("BLURPLE")
          .setTitle(`New warning added!`)
          .setFooter({
            text: `requested by: ${message.author.tag}`,
            iconURL: message.author.displayAvatarURL({ dynamic: true }),
          })
          .setDescription(
            `**Target:** ${target.user.tag} | ||${target.id}||\n\n**Reason:** ${reason}`
          ),
      ],
    });
  },
};
