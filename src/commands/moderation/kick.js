const Discord = require('discord.js');
const CommandStructure =
  require('../../structure/CommandStructure').CommandStructure;
module.exports = {
  name: 'kick',
  description: 'Kicks a member',
  permissions: ['KICK_MEMBERS'],
  aliases: ['k'],
  category: 'Moderation',
  disabledChannel: [],
  deleteTrigger: true,
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({ client, message, args }) => {
    try {
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!member) return message.reply({
        embeds: [
          new Discord.MessageEmbed()
            .setDescription("Please give the user id or mention a user to kick!")
        ]
      }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000)
      })
      let reason = "No reason provided.";
      if (args[1]) {
        reason = args[1].join(" ");
      }
      await member.send({
        embeds: [
          new Discord.MessageEmbed()
            .setDescription(
              `You were kicked out from ${message.guild.name} for the following reason: **${reason}**`
            )
        ]
      })
      await member.kick(reason);
      let msg = await message.reply(`${member.user.tag} was kicked because of **${reason}**`);
      setTimeout(() => { msg.delete() }, 5000)
    } catch (e) {
      await message.reply(`${e}`);
    }
  },
};
