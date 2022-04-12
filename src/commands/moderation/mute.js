const { MessageEmbed } = require("discord.js");
const CommandStructure =
  require("../../structure/CommandStructure").CommandStructure;
const ms = require("moment");
const { MutesModel } = require("../../schema/mutes");
module.exports = {
  name: "mute",
  description: "Mute a member",
  permissions: ["MANAGE_MESSAGES"],
  aliases: ["m"],
  category: "Moderation",
  disabledChannel: [],
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({ client, message, args }) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`You need to mention a member to mute!`),
        ],
      });
    }
    args.shift();
    let duration = null;
    let reason = "No reason provided";
    if (args.length > 0) {
      if (ms(args[0]).isValid()) {
        duration = ms(args[0]);
        args.shift();
      }
      if (args.length > 0) {
        reason = args.join(" ");
      }
    }
    if (!member.kickable) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `I can't mute this member because I don't have the permissions to do so!`
            ),
        ],
      });
    }
    if (member.id === message.author.id) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`You can't mute yourself!`),
        ],
      });
    }
    const embed = new MessageEmbed()
      .setColor("RED")
      .setDescription(
        `${member.user.tag} has been muted from **${message.guild.name}**`
      )
      .addField("Reason", reason)
      .addField("Moderator", message.author.tag)
      .addField("Duration", duration ? duration.humanize() : "Permanent")
      .setAuthor({
        name: message.guild.name,
        iconURL: message.guild.iconURL(),
      })
      .setTimestamp();
    await member
      .send({
        embeds: [embed],
      })
      .catch(() => {});

    // Now add mute role to the member
    const muteRole = (await message.guild.roles.fetch()).find(
      (r) => r.name === "Muted"
    );
    if (!muteRole) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(
              `No mute role found! Please create a role called \`Muted\` and assign it to the bot.`
            ),
        ],
      });
    }

    await member.roles.add(muteRole);
    await message.reply({
      embeds: [embed],
    });
    // Add user to the muted table
    MutesModel.create({
      id: member.id,
      guild: message.guild.id,
      moderator: message.author.id,
      reason: reason,
      active: true,
      unmuteOn: duration ? duration.valueOf() + Date.now() : null,
    });
  },
};
