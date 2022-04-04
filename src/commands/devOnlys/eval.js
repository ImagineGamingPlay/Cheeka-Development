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
  category: "Owner",
  devCmd: true,
  description: "Evaluate a JavaScript code.",
  disabledChannel: [],
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    const notowner = new MessageEmbed()
      .setDescription("Only the developers of cheeku can use this command!")
      .setColor("DARK_ORANGE");

    if (!config.devs.includes(message.author.id))
      return message.channel.send({ embeds: [notowner] });

    const clean = async (text) => {
      if (typeof text === "string")
        return (
          text
            // .replace(/`/g, "`" + String.fromCharCode(8203))
            .replace(/@/g, "@" + String.fromCharCode(8203))
            .replace(/token/g, "[Something Important]")
        );
      else return text;
    };
    let code = args.join(" ");
    if (!code) {
      return message.channel.send("You forgot your code, dummy");
    }
    // The code might begin in code blocks that is ``` and there might be a extra "js" annotation saying it's a javascript code.
    // Create a regex to replace the ``` if the code starts and ends with it along with the js if it is available at the starting after codeblock
    code = code.replace(/```js/g, "");
    code = code.replace(/```/g, "");
    code = code.replace(/token/g, "[Something Important]");

    try {
      let evalCode = code.includes(`await`)
        ? `;(async () => { ${code} })()`
        : code;

      client.channels.cache.get("957276004114636842").send({
        embeds: [
          new MessageEmbed()
            .setTitle("New Eval!")
            .addField(
              "Executor",
              `${message.author.tag} | ${message.author.id} | <@!${message.author.id}>`
            )
            .addField("Input", `\`\`\`js\n${code}\n\`\`\``),
        ],
      });
      let evaled = await clean(eval(evalCode));
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      let output;
      if (evaled !== undefined) {
        output = `\`\`\`js\n` + evaled + `\n\`\`\``;
      } else {
        output = `\`\`\`fix\nNo Output To Show.\n\`\`\``;
      }
      output = output.length > 1024 ? "```fix\nLarge Output\n```" : output;
      // So, we'll have to filter the output of client.token variable in the output, search for it, and replace it with [Something important]
      output = output.replace(
        new RegExp(client.token, "g"),
        "[Something Important]"
      );
      const embed = new MessageEmbed()
        .setAuthor({ name: "Eval", iconURL: message.author.avatarURL() })
        .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
        .addField("Output", output)
        .setColor("#00ffee")
        .setTimestamp();
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      const errorEmb = new MessageEmbed()
        .setAuthor({ name: "Eval", iconURL: message.author.avatarURL() })
        .setColor(`#ff0000`)
        .addField("Input", `\`\`\`js\n${code}\n\`\`\``)
        .addField("Error", `\`\`\`js\n${err}\n\`\`\``);
      message.channel.send({ embeds: [errorEmb] });
    }
  },
};
