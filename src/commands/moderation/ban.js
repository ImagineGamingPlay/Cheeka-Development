const {MessageEmbed} = require('discord.js');
const CommandStructure =
  require('../../structure/CommandStructure').CommandStructure;
const humanize = require('pretty-ms');
const ms = s => {
  const units = [
    {name: 'd', amount: 86400000},
    {name: 'h', amount: 3600000},
    {name: 'm', amount: 60000},
    {name: 's', amount: 1000},
  ];
  let total = 0;
  for (const unit of units) {
    const regex = new RegExp(`(\\d+)${unit.name}`);
    const match = s.match(regex);
    if (match) {
      total += parseInt(match[1]) * unit.amount;
    }
  }
  return total;
};
const {BansModel} = require('../../schema/bans');
module.exports = {
  name: 'ban',
  description: 'Bans a member',
  permissions: ['BAN_MEMBERS'],
  aliases: ['b'],
  category: 'Moderation',
  deleteTrigger: true,
  disabledChannel: [],
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({client, message, args}) => {
    // Get the first mention from the message
    const member = message.mentions.members.first();
    // If there is no member, send a embed
    if (!member) {
      return message.channel.send(
        new MessageEmbed()
          .setColor('RED')
          .setDescription(`You need to mention a member to ban!`),
      );
    }
    // Shift one arg to remove the user mention
    args.shift();
    // Get the another arg, if there is no arg make the ban permanent and reason to be "No reason provided", if there is another arg check using ms() if it's invalid join it and make it the reason else shift the arg and check for another, if it exists its the real reason
    let duration = null;
    let reason = 'No reason provided';
    if (args.length > 0) {
      if (ms(args[0]) > 1) {
        duration = ms(args[0]);
        args.shift();
      }
      if (args.length > 0) {
        reason = args.join(' ');
      }
    }

    // Make sure the member is actually bannable
    if (!member.bannable) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              `I can't ban this member because I don't have the permissions to do so!`,
            ),
        ],
      });
    }

    // Make sure that message author is not trying to ban themself
    if (member.id === message.author.id) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(`You can't ban yourself!`),
        ],
      });
    }

    // Make sure that author has role higher than the member
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) < 1
    ) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              `You can't ban this member because you don't have the permissions to do so!`,
            ),
        ],
      });
    }

    // Send a message to the banned user with a message embed saying that he was banned, the reason, the moderator, the duration and the guild as the author and timestamp set.
    const embed = new MessageEmbed()
      .setColor('RED')
      .setDescription(
        `${member.user.tag} has been banned from **${message.guild.name}**`,
      )
      .addField('Reason', reason)
      .addField('Moderator', message.author.tag)
      .addField('Duration', duration ? humanize(duration) : 'Permanent')
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

    // Now, ban the mentioned member permanently
    await member.ban({
      reason: reason,
    });
    await message.reply({
      embeds: [embed],
    });
    BansModel.create({
      id: member.id,
      unbanOn: duration ? duration + Date.now() : null,
      reason: reason,
      moderator: message.author.id,
      active: true,
      guild: message.guild.id,
    });
  },
};
