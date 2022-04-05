const { MessageButton, MessageEmbed, MessageActionRow } = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a member",
  permissions: ["BAN_MEMBERS"],
  aliases: ["b"],
  category: "Moderation",
  disabledChannel: [],
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    try {
      const kickErr = new MessageEmbed()
       .setDescription('**You cannot kick this member because their role is higher/equal to yours!**')
       .setColor('RED')
       .setFooter(message.author.displayAvatarUrl(), message.author.tag)
      //--------------------------------------------------------------------------------------------------
      const kickErr1 = new MessageEmbed()
        .setDescription('**I cannot kick this member because their role is higher/equal to mine!**')
        .setColor('RED')
        .setFooter(message.author.displayAvatarUrl(), message.author.tag)
      //--------------------------------------------------------------------------------------------------
      let member =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      //--------------------------------------------------------------------------------------------------
        const mentionedPosition = member.roles.highest.position 
        const memberPosition = message.member.roles.highest.position 
        const botPosition = message.guild.me.roles.highest.position 
      //--------------------------------------------------------------------------------------------------
      if (!member) return message.reply("You need to mention someone to ban!");
      const reason = args.slice(1).join(" ");
      
      if(member.user.id === message.author.id) return message.channel.send("u cant ban youself")


        if(memberPosition <= mentionedPosition) { 

            return message.channel.send({ embeds: [kickErr] }) 
        } else if (botPosition <= mentionedPosition) { 
            
            message.channel.send({ embeds: [kickErr1] }) 
        } 
      //Notifcation Embed
      const em = new MessageEmbed()
        .setTitle(`Server Ban`)
        .setFooter({ text: `Banned by ${message.author.tag}` })
        .setColor(`RED`);
      //Fetching reason
      if (!reason) {
        em.setDescription(
          `You have been banned from ${message.guild.name} \nIf you think this is a mistake, please appeal in [here](https://discord.com/api/oauth2/authorize?client_id=900535112955998271&redirect_uri=https%3A%2F%2Fimagine.cf%2Fcallback&response_type=code&scope=email%20identify)`
        );
      } else {
        em.setDescription(
          `You have been banned from ${message.guild.name} for **${reason}** \nIf you think this is a mistake, please appeal in [here](https://discord.com/api/oauth2/authorize?client_id=900535112955998271&redirect_uri=https%3A%2F%2Fimagine.cf%2Fcallback&response_type=code&scope=email%20identify)`
        );
      }
      //Appeal Button
      const r = new MessageActionRow().addComponents(
        new MessageButton()
          .setStyle(`LINK`)
          .setLabel(`Appeal`)
          .setURL(
            `https://discord.com/api/oauth2/authorize?client_id=900535112955998271&redirect_uri=https%3A%2F%2Fimagine.cf%2Fcallback&response_type=code&scope=email%20identify`
          )
          .setEmoji(`🔗`)
      );
      await member.send({ embeds: [em], components: [r] });
      await member.ban({ reason: reason });
      if (!reason) {
        await message.reply(`${member.user.tag} was banned`);
      } else {
        await message.reply(`${member.user.tag} was banned for **${reason}**!`);
      }
    } catch (e) {
      await message.reply(`An error occured: \`\`\`${e}\`\`\``);
      console.log(e);
    }
  },
};
