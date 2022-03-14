const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    if (oldMessage.author.bot) return;

    const division = 1950; //as an embed description can only have upto 4096 characters, we are dividing it to fit both old and new messages
    const orginalMsg =
      oldMessage.content.slice(0, division) +
      (oldMessage.content.length > division ? " ..." : ""); //this line makes that if the content is more than 1950 characters, it'll add an ... at the end
    const editedMsg =
      newMessage.content.slice(0, division) +
      (newMessage.content.length > division ? " ..." : ""); //does the same as above but for edited message

    let editedLogEmbed = new MessageEmbed()
      .setColor("BLURPLE")
      .setDescription(
        `A [message](${newMessage.url}) has been edited!\n\n**Orginal:** \`\`\`${orginalMsg}\`\`\`\n**Edited:** \`\`\`${editedMsg}\`\`\``
      )
      .setAuthor({
        name: `${newMessage.author.username}`,
        iconURL: `${newMessage.author.displayAvatarURL({ dynamic: true })}`,
      })
      .addFields({ name: "Channel", value: `${newMessage.channel}` });

    if (newMessage.attachments.size > 0) {
      editedLogEmbed.addField(
        `Attachments:`,
        `${newMessage.attachments.map((a) => a.url)}`,
        true
      );
    }

    newMessage.guild.channels.cache
      .get("952514063873761328")
      .send({ embeds: [editedLogEmbed] });
  },
};
