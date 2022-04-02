const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    const handleCommands = (interaction, client) => {
      const { commandName, options } = interaction;

      if (commandName === "function") {
        const query = options.getString("name");

        if (query === "role-selector") {
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
          interaction.channel.send({
            embeds: [roleSelectorEmbed],
            components: [roleSelectorRow],
          });
        }
      }
    };

    const handleSelectMenus = async (interaction, client) => {
      const { values, customId } = interaction;

      if (customId === "role-selector-menu") {
        await interaction.reply({
          content: "updating your roles...",
          components: [
            new MessageActionRow().addComponents(
              new MessageButton()
                .setLabel("show my roles")
                .setStyle("PRIMARY")
                .setCustomId("show-my-roles")
            ),
          ],
          ephemeral: true,
        });

        for (const id of values) {
          if (!interaction.member.roles.cache.has(id)) {
            await interaction.member.roles.add(id, ["self-assignable role"]);
            interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor("GREEN")
                  .setTitle("Roles Added")
                  .setDescription(`Added role(s): <@&${id}>`),
              ],
              ephemeral: true,
            });
          } else if (interaction.member.roles.cache.has(id)) {
            await interaction.member.roles.remove(id, ["self-assignable role"]);
            interaction.followUp({
              embeds: [
                new MessageEmbed()
                  .setColor("RED")
                  .setTitle("Roles removed")
                  .setDescription(`Removed role(s): <@&${id}>`),
              ],
              ephemeral: true,
            });
          }
        }
      }
    };

    const handleButtons = async (interaction, client) => {
      if (interaction.customId === "show-my-roles") {
        const rolesEmbed = new MessageEmbed()
          .setTitle(`Roles of ${interaction.member.user.username}`)
          .setDescription(
            `${
              member.roles.cache
                .map((r) => r)
                .join(" ")
                .replace("@everyone", " ") || "You got no roles apparently..."
            }`
          );

        interaction.reply({ embeds: [rolesEmbed] });
      }
    };
    if (interaction.isCommand()) handleCommands(interaction, client);
    else if (interaction.isSelectMenu()) handleSelectMenus(interaction, client);
    else if ((interaction, isButton())) handleButtons(interaction, client);
  },
};
