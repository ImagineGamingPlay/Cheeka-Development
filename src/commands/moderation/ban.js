const { DiscordAPIError } = require("discord.js");
const Discord = require('discord.js')


module.exports = {
  name: "ban",
  description: "Bans a member",
  aliases: ["b"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    try {
      if (
        !message.member.permissions.has("BAN_MEMBERS") ||
        !message.guild.me.permissions.has("BAN_MEMBERS")
      )
        return;
      let member = message.mentions.members.first();
      if (!member) await message.reply("You need to mention someone to ban!");
      const reason = args.slice(1).join(" ");
      //Notifcation Embed
      const em = new Discord.MessageEmbed()
      .setTitle(`Server Ban`)
      .setFooter(`Banned by ${message.author.tag}`)
      .setColor(`RED`)
      //Fetching reason
      if (!reason) {
        em.setDescription(`You have been banned from ${message.guild.name} \nIf you think this is a mistake, please appeal in [here](https://discord.com/api/oauth2/authorize?client_id=900535112955998271&redirect_uri=https%3A%2F%2Fimagine.cf%2Fcallback&response_type=code&scope=email%20identify)`)
      } else {
        em.setDescription(`You have been banned from ${message.guild.name} for **${reason}** \nIf you think this is a mistake, please appeal in [here](https://discord.com/api/oauth2/authorize?client_id=900535112955998271&redirect_uri=https%3A%2F%2Fimagine.cf%2Fcallback&response_type=code&scope=email%20identify)`)
      }
      //Appeal Button
      const r = new Discord.MessageActionRow()
      .addComponents(
        new Discord.MessageButton()
        .setStyle(`LINK`)
        .setLabel(`Appeal`)
        .setURL(`https://discord.com/api/oauth2/authorize?client_id=900535112955998271&redirect_uri=https%3A%2F%2Fimagine.cf%2Fcallback&response_type=code&scope=email%20identify`)
        .setEmoji(`🔗`)
      )
      await member.send({embeds:[em], components:[r]})
      if(!reason) {
        await message.reply(`${member.user.tag} was banned`)
      } else {
      await message.reply(`${member.user.tag} was banned for **${reason}**!`);
      }
    } catch (e) {
      message.reply(`An error occured: \`\`\`${e}\`\`\``)
      console.log(e)
    }
  },
};
