const Discord = require("discord.js");
const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  MessageSelectMenu,
  MessageAttachment,
} = require("discord.js");

module.exports = {
  name: "eval",
  category: "owner",
  owner: true,
  description: "Evaluate a JavaScript code.",

  run: async (client, message, args) => {
    const notowner = new MessageEmbed()
      .setDescription("Only the developers of cheeku can use this command!")
      .setColor("DARK_ORANGE");

    if (!config.developers.includes(message.author.id))
      return message.channel.send({ embeds: [notowner] });

    const clean = async (text) => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203))
          .replace(client.token, "[Something Important]");
      else return text;
    };

    try {
      const code = args.join(" ");
      if (!code) {
        return message.channel.send("Please Provide A code to eval!");
      }
      clean(code);

      let evaled = eval(";(async () => {" + code + "})()");

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      const embed = new MessageEmbed()
        .setAuthor({ name: "Eval", iconURL: message.author.avatarURL() })
        .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
        .addField("Output", `\`\`\`js\n` + evaled + `\n\`\`\``)
        .setColor("#00ffee");

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.channel.send(`\`\`\`js\n${err}\n\`\`\``);
    }
  },
};
