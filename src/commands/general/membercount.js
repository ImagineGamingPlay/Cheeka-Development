const {MessageEmbed} = require('discord.js');
const CommandStructure =
  require('../../structure/CommandStructure').CommandStructure;

module.exports = {
  name: 'membercount',
  description: 'Shows the current member count of the server.',
  aliases: ['members', 'member', 'memcount', 'usercount'],
  usage: 'membercount',
  category: 'General',
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({client, message, args}) => {
    const memberCount = message.guild.memberCount;
    const botCount = message.guild.botcount;
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle('Member Count')
          .setDescription(`**Total Members:** ${message.guild.memberCount}`)
          .setColor('BLURPLE')
          .setTimestamp(),
      ],
    });
  },
};
