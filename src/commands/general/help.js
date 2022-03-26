const prettyMs = require("pretty-ms");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  description: "Learn about the commands of the bot.",
  aliases: [],
  permissions: [],
  category: "General",
  disabledChannel: [],
  cooldown: 60,
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    let commands = Array.from(client.commands.values());
    // Commands is a array of commands, commands consists of name, description, aliases, category
    // Group commands by each category
    let categories = commands.reduce((acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    }, {});
    let categoryIndex = 1;
    // Now create a string in format of **Category**\n\n**Command** - **Description**, create this per each embed
    let embeds = Object.keys(categories).map((category) => {
      let commands = categories[category];
      let commandsString = commands
        .map((command) => `**${command.name}** - \`${command.description}\``)
        .join("\n");
      categoryIndex++;
      return new MessageEmbed()
        .setTitle(`**${category}**`)
        .setDescription(commandsString)
        .setColor("BLURPLE")
        .setFooter({
          text: `Page ${categoryIndex - 1}/${Object.keys(categories).length}`,
        });
    });
    // Now send the embeds
    await message.channel.send({
      embeds,
    });
  },
};
