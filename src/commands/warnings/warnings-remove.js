// const warningsSchema = require("../../schema/warnings");
// const { MessageEmbed } = require("discord.js");

// module.exports = {
//   name: "warnings-remove",
//   description: "remove a warning from a member",
//   aliases: ["warn-remove"],
//   permissions: ["KICK_MEMBERS"],
//   run: async ({ client, message, args }) => {
//     const warnId = args[0] - 1;
//     const target = message.mentions.members.first();
//     const reason = args.slice(2).join(" ") || "No reason provided";
//     warningsSchema.findOne(
//       {
//         guild: message.guildId,
//         userId: target.id,
//         userTag: target.user.tag,
//       },
//       async (err, data) => {
//         if (err) throw err;
//         if (data) {
//           data.content.splice(warnId, 1);
//           message.reply({
//             embeds: [
//               new MessageEmbed()
//                 .setAuthor({
//                   name: target.user.tag,
//                   iconURL: target.displayAvatarURL({ dynamic: true }),
//                 })
//                 .setColor("BLURPLE")
//                 .setTitle(`Warning removed!`)
//                 .setFooter({
//                   text: `executed by: ${message.author.tag}`,
//                   iconURL: message.author.displayAvatarURL({ dynamic: true }),
//                 })
//                 .setDescription(
//                   `Target: ${target.user.tag} | ||${target.id}||\n**Warn ID:** ${warnId + 1}\n\n**Reason:** ${reason}`
//                 ),
//             ],
//           });
//           data.save();
//         } else {
//           message.reply({
//             embeds: [
//               new MessageEmbed()
//                 .setAuthor({
//                   name: target.user.tag,
//                   iconURL: target.displayAvatarURL({ dynamic: true }),
//                 })
//                 .setColor("BLURPLE")
//                 .setTitle(`No warnings found for this user`)
//                 .setFooter({
//                   text: `executed by: ${message.author.tag}`,
//                   iconURL: message.author.displayAvatarURL({ dynamic: true }),
//                 }),
//             ],
//           });
//         }
//       }
//     );
//   },
// };
