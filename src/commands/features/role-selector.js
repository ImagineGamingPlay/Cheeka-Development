const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "role-selector",
  description: "send a message with role select menu",
  permissions: ["MANAGE_ROLES"],
  run: async ({ client, message, args }) => {
    const roles = [
      {
        label: "Good Guy",
        description: "be the good guy",
        value: "952541064529584159",
        emoji: "🥇",
      },
      {
        label: "Netural Guy",
        description: "be the netural guy",
        value: "959801205553504366",
        emoji: "🥈",
      },
      {
        label: "Bad Guy",
        description: "be the bad guy",
        value: "959801093775323206",
        emoji: "🥉",
      },
    ];

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
        .setMaxValues(roles.length)
        .setCustomId("role-selector-menu")
        .setPlaceholder("Select a role")
        .addOptions([
          {
            label: roles[0].label,
            description: roles[0].description,
            value: roles[0].value,
            emoji: roles[0].emoji,
          },
          {
            label: roles[1].label,
            description: roles[1].description,
            value: roles[1].value,
            emoji: roles[1].emoji,
          },
          {
            label: roles[2].label,
            description: roles[2].description,
            value: roles[2].value,
            emoji: roles[2].emoji,
          },
        ])
    );
    message.channel.send({
      embeds: [roleSelectorEmbed],
      components: [roleSelectorRow],
    });
  },
};
