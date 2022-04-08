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
      return;
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
