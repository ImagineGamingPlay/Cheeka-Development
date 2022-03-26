const { MessageEmbed, TextChannel } = require("discord.js");

module.exports = {
  name: "accept-suggestion",
  description: "accept a suggestion",
  aliases: ["acc-suggest", "acc-sug"],
  permissions: ["MANAGE_MESSAGES"],
  disabledChannel: [],
  category: "Suggestion",
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    const messageID = args[0];
    const reason = args.slice(1).join(" ") || "No reason given";
    /**
     * @type {TextChannel}
     */
    const suggestionChannel = await message.guild.channels.fetch(
      "953482520542978141"
    );
    const suggestedMsg = await suggestionChannel.messages.fetch(messageID);
    const suggestEmbed = suggestedMsg.embeds[0];

    if (!messageID) return message.reply("Please provide a message ID");

    let acceptedEmbed = new MessageEmbed()
      .setAuthor({
        name: suggestEmbed.author.name,
        iconURL: suggestEmbed.author.iconURL,
      })

      .setTitle(suggestEmbed.title)
      .setDescription(suggestEmbed.description)
      .setColor("GREEN")
      .addField(
        "Status",
        `🟢 Nice idea! We're working on it!\n\n**Reason:** ${reason}`
      )
      .setFooter({
        text: `accepted by: ${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      });
    try {
      await suggestedMsg.edit({ embeds: [acceptedEmbed] });
      await message.reply("Suggestion accepted!");
    } catch (err) {
      console.log(err);
      await message.reply(`\`\`\`${err}\`\`\``);
    }
  },
};
