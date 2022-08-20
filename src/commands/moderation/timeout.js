const ms = require('ms');
const CommandStructure =
  require('../../structure/CommandStructure').CommandStructure;
const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'timeout',
  description: 'Timeouts a member',
  aliases: ['tm', 'tmout'],
  disabledChannel: [],
  category: 'Moderation',
  permissions: ['KICK_MEMBERS', 'MODERATE_MEMBERS'],
  deleteTrigger: true,
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({client, message, args}) => {
    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]);
    if (!member) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(`You need to mention a member to timeout!`),
        ],
      });
    }
    args.shift();
    let duration = null;
    let reason = 'No reason provided';
    if (args.length > 0) {
      if (ms(args[0]).isValid()) {
        duration = ms(args[0]);
        args.shift();
      }
      if (args.length > 0) {
        reason = args.join(' ');
      }
    }
    if (!member.kickable) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              `I can't timeout this member because I don't have the permissions to do so!`,
            ),
        ],
      });
    }
    if (member.id === message.author.id) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(`You can't timeout yourself!`),
        ],
      });
    }

    // Make sure that message author has role higher than the member
    if (
      message.member.roles.highest.comparePositionTo(member.roles.highest) < 1
    ) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              `You can't timeout this member because you don't have the permissions to do so!`,
            ),
        ],
      });
    }

    if (duration) {
      await member
        .send({
          embeds: [
            new MessageEmbed()
              .setColor('RED')
              .setDescription(
                `You have been timed out in ${message.guild.name} for ${duration} for the following reason: ${reason}`,
              ),
          ],
        })
        .catch(() => {});

      await member.timeout(duration, reason);

      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('GREEN')
            .setDescription(
              `${member.user.tag} has been timed out for ${duration} for the following reason: ${reason}`,
            ),
        ],
      });
    } else {
      // Send need duration
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(`You need to specify a duration for the timeout!`),
        ],
      });
    }
  },
};
