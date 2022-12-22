const {MessageEmbed} = require('discord.js');
const {afkUsers} = require('../../utils/Cache');
const CommandStructure =
  require('../../structure/CommandStructure').CommandStructure;
module.exports = {
  name: 'afk',
  description: 'Marks you away from keyboard.',
  aliases: ['away'],
  permissions: [],
  disabledChannel: ['743528053019508848'], //main chat
  category: 'General',
  cooldown: 120,
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({client, message, args}) => {
    // Make sure the user is not already afk
    if (afkUsers.has(message.author.id)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription('You are already afk!'),
        ],
      });
    }
    // Check if the user has provided a reason, it can be more than one word but must be less than 50
    let reason = args.join(' ');
    if (reason === '') reason = 'No reason provided.';
    if (reason.length > 60) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('RED')
            .setDescription(
              'Your reason is too long! You can only provide 60 characters!',
            ),
        ],
      });
    }
    // Set the user as afk
    afkUsers.set(message.author.id, {
      reason,
      username: message.member.displayName,
    });
    // Modify the user's username and set it to [AFK] $username, if the total length of the username exceeds 32, cut the username to 32 characters by removing ends
    try {
      if(!message.member.nickname.includes("[AFK]")) {
      await message.member.setNickname(
        `[AFK] ${
          message.member.displayName.length > 32
            ? message.member.displayName.slice(0, 32)
            : message.member.displayName
        }`,
      );
      } else {
        message.reply({
          embeds: [
            new MessageEmbed()
              .setColor('RANDOM')
              .setTitle('AFK!')
              .setDescription(`I've set you to be AFK.`)
              .addField('User', message.member.displayName, false)
              .addField('Reason', reason, false),
          ],
        });
      }
    } catch (ignored) {}
    // Send the message saying set as AFK
    return message.reply({
      embeds: [
        new MessageEmbed()
          .setColor('RANDOM')
          .setTitle('AFK!')
          .setDescription(`I've set you to be AFK.`)
          .addField('User', message.member.displayName, false)
          .addField('Reason', reason, false),
      ],
    });
  },
};
