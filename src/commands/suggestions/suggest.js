const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "suggest",
  description: "make to suggestion regarding the server",
  aliases: ["sug"],
  run: async ({ client, message, args }) => {
    const suggestion = args.join(" ");
    const suggestionChannel =
      message.guild.channels.cache.get("953482520542978141");

    if (!suggestion) return message.reply("Please specify a suggestion!");

    let suggestEmbed = new MessageEmbed()
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      })

      .setTitle(`${message.author.username} suggests:`)
      .setDescription(`- ${suggestion}`)
      .setColor("WHITE")
      .addField(
        "Status",
        ":bar_chart: Waiting for community feedback. Please vote"
      )
      .setFooter({
        text: "Wanna suggest something too? try .suggest <suggestion>",
      });

    try {
      suggestionChannel.send({ embeds: [suggestEmbed] });
      const suggestedMsg = await suggestionChannel.send({
        embeds: [suggestEmbed],
      });

      suggestedMsg.react("✔");
      suggestedMsg.react("❌");

      message.reply("Your suggestion has been sent in <#953482520542978141>");
    } catch (err) {
      console.log(err);
    }
  },
};
