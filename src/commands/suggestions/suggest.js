const { MessageEmbed } = require("discord.js");
const CommandStructure =
  require("../../structure/CommandStructure").CommandStructure;
module.exports = {
  name: "suggest",
  description: "make to suggestion regarding the server",
  aliases: ["sug"],
  disabledChannel: [],
  category: "Suggestion",
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({ client, message, args }) => {
    const suggestion = args.join(" ");
    const suggestionChannel =
      message.guild.channels.cache.get("953482520542978141");
    const suggestChannel =
          message.guild.channels.cache.get(`suggestion-channel-id-in-igp`)

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

    if(message.guild.id !== `697495719816462436`){
    try {
      const suggestedMsg = await suggestionChannel.send({
        embeds: [suggestEmbed],
      });

      await suggestedMsg.react("✔");
      await suggestedMsg.react("❌");

      await message.reply(
        "Your suggestion has been sent in <#953482520542978141>"
      );
    } catch (err) {
      console.log(err);
    }
    } else {
     try {
      const suggestedMsg = await suggestChannel.send({
        embeds: [suggestEmbed],
      });

      await suggestedMsg.react("✔");
      await suggestedMsg.react("❌");

      await message.reply(
        `Your suggestion has been sent in <#${suggestChannel.id}>`
      );
    } catch (err) {
      console.log(err);
    }
    }
  },
};
