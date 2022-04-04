const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  description: "Get the avatar of a user",
  category: "general",
  aliases: ["av"],
  usage: "avatar [user]",
  run: async ({ client, message, args }) => {
    try {
      const user =
        message.mentions.users.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.author;

      const username = user.username || user.user.username;
      const avatarEmbed = new MessageEmbed()
        .setColor("BLURPLE")
        .setTitle(`${username}'s Avatar`)
        .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setFooter({
          text: `Requested by ${message.author.tag}`,
          iconURL: message.author.displayAvatarURL({
            dynamic: true,
            size: 2048,
          }),
        });

      message.reply({ embeds: [avatarEmbed] });
    } catch (err) {
      console.error(err);
      message.reply(`\`\`\`${err}\`\`\``);
    }
  },
};
