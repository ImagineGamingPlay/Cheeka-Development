const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { optionsArr } = require("../../jsons/roleSelectorOptions.json");

module.exports = {
  name: "role-selector",
  description: "send a message with role select menu",
  permissions: ["MANAGE_ROLES"],
  run: async ({ client, message, args }) => {
    const roleSelectorEmbed = new MessageEmbed()
      .setTitle("Personalize Your Server Profile")
      .setDescription(
        "Use the below dropdown menu to select the roles you want to have. If you'd like to remove the role, select it again.\nNote that these roles don't grant you extra permissions, you are allowed to select as many roles as you want!"
      )
      .setColor("BLURPLE")
      .setFooter({ text: "enjoy your roles!" });

    const roleSelectorRow = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setMinValues(1)
        .setCustomId("role-selector-menu")
        .setPlaceholder("Select a role")
        .addOptions(optionsArr)
    );
    message.channel.send({
      embeds: [roleSelectorEmbed],
      components: [roleSelectorRow],
    });
  },
};
