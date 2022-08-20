//Snipe Command
const {MessageEmbed} = require('discord.js');
const CommandStructure =
  require('../../structure/CommandStructure').CommandStructure;
module.exports = {
  name: 'snipe',
  category: 'Moderation',
  description: 'Snipe a message.',
  devOnly: false,
  disabledChannel: [],
  guildOnly: true,
  deleteTrigger: true,
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({client, message, args}) => {
    //fetch the snipes
    // if(!config.devs.includes(message.author.id) || !message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("You don't have permission to use this command!");
    const channel =
      message.mentions?.channels?.first() ??
      message.guild?.channels?.cache?.get(args[0]) ??
      message.channel;
    const snipes = client.snipes.get(channel.id);
    let eSnipe = client.eSnipe.get(channel.id);
    if (!snipes && !eSnipe)
      return message.channel.send(`Nothing to snipe in ${channel}`);
    // Check for the snipe in eSnipe
    let embeds = [];
    if (snipes) {
      let content = snipes?.message ? `\`${snipes?.message}\`` : '`No content`';
      const embed = new MessageEmbed()
        .setTitle(`🔫 Snipe in ${channel.name}`)
        .setColor('YELLOW')
        .setDescription(`*Content:*\n${content}`)
        .setAuthor({
          name: `${snipes.author?.tag}`,
          iconURL: snipes.author?.displayAvatarURL() ?? null,
        })
        .setImage(snipes.attachment ?? null)
        .addField('Time', `${new Date(snipes.time).toUTCString()}`);

      embeds.push(embed);
    }
    if (eSnipe) {
      // Create a description that'll be formatted in **Current Content:**\n ${content}\n\n **Previous Content:**\n ${eSnipe.prevs.content}
      let description = `**Current Content:**\n ${eSnipe.currs}\n\n **Previous Content:**\n ${eSnipe.prevs}`;
      // Create the embed
      const embed = new MessageEmbed()
        .setTitle(`🔫 Edit Snipe in ${channel.name}`)
        .setColor('YELLOW')
        .setDescription(description)
        .setAuthor({
          name: `${eSnipe.author?.tag}`,
          iconURL: eSnipe.author?.displayAvatarURL() ?? null,
        })
        .addField('Time', `${new Date(eSnipe.time).toUTCString()}`);
      // Send the embed
      embeds.push(embed);
    }
    // Send the embeds
    message.channel.send({
      embeds,
    });
  },
};
