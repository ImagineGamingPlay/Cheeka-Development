const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "8ball",
  description: "ask a question, the bot will reply to it.",
  category: "Fun",
  run: async ({ client, message, args }) => {
    const answers = [
      "yes.",
      "Absolutely",
      "ofc",
      "obviously yes",
      "The following statement is true.",
      "No.",
      "Nope",
      "false statement",
      "I'll consider it a no",
      "Never.",
      "maybe",
      "probably",
      "idk",
    ];

    const question = args.join(" ");
    const answer = answers[Math.floor(Math.random() * answers.length)];

    const ballEmbed = new MessageEmbed()
      .setAuthor({
        name: `${message.author.tag}`,
        iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`,
      })
      .setTitle(question)
      .setDescription(`- ${answer}`)
      .setColor("WHITE");

    message.reply({
      embeds: [ballEmbed],
    });
  },
};
