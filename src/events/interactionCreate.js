const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  ButtonInteraction,
} = require("discord.js");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isCommand()) {
      return;
    } else if (interaction.isSelectMenu()) {
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
    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);

      if (!button) {
        return await interaction.reply({
          content: "Button not handled. Please contact the devs!",
          ephemeral: true,
        });
      } else if (
        button.permissions &&
        !interaction.member.permissions.has(button.permissions)
      ) {
        return await interaction.reply({
          content:
            "You do not have the required permissions to use this button.",
          ephemeral: true,
        });
      } else if (
        button.devOnly &&
        !config.devs.includes(interaction.member.id)
      ) {
        return await interaction.reply({
          content: "This button is only available for developers.",
          ephemeral: true,
        });
      } else if (
        button.ownerOnly &&
        interaction.guild.ownerId !== interaction.member.id
      ) {
        return await interaction.reply({
          content: "This button is only available for the guild owner.",
          ephemeral: true,
        });
      }

      try {
        await button.run(client, interaction);
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: `An error occured. Please contact the devs! Error: \`\`\`${err}\`\`\``,
          ephemeral: true,
        });
      }
    }
  },
};
