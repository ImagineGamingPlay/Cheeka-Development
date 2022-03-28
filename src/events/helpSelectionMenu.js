const { MessageEmbed, WebhookClient } = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (!interaction.isSelectMenu()) return;
    if (!interaction.customId.startsWith("help_")) return;
    let category = interaction.values[0].split("_")[1];
    // Get all the commands
    let Ccommands = Array.from(client.commands.values());
    let commands = Ccommands.filter((command) => {
      return command.category === category;
    });
    // Now edit the message to show the commands
    let embed = new MessageEmbed()
      .setColor("BLURPLE")
      .setTitle("Help | " + category);
    // For each command in the category, add it to the embed
    let toBuildString = "";
    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      toBuildString += `**${command.name}** - \`${command.description}\` ${
        command.permissions ? `\`[${command.permissions.join(", ")}]\`` : ""
      } ${command.devCmd ? "`[DEV]`" : ""}\n`;
    }
    embed.setDescription(toBuildString);
    // Send the embed
    await interaction.reply({
      content: "Done! Updated the category.",
      ephemeral: true,
    });
    await interaction.message.edit({
      embeds: [embed],
    });
  },
};
