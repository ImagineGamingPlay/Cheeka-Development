const prettyMs = require("pretty-ms");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

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
    // Send a message embed with BLUPRPLEL as color, at title type Select category, and at description put Please put a category that you want to view commands for.
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
    console.log(categories);
    let embed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("Select category")
      .setDescription(
        "Please select a category from the selection menu given below to view commands."
      );
    let cat = Object.keys(categories).map((category) => {
      return {
        label: category,
        value: "help_" + category,
      };
    });
    let menu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("help_" + message.member.id)
        .setPlaceholder("Nothing selected")
        .addOptions(cat)
    );
    // Send the message embed to the channel and attach a selection menu with all the categories.
    try {
      await message.reply({
        embeds: [embed],
        components: [menu],
      });
    } catch (e) {
      return;
    }
  },
};
