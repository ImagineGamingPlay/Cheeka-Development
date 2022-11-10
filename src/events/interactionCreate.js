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
    if (interaction.isSelectMenu()) {
      const selectMenu = client.selectMenus.get(interaction.customId);

      if (!selectMenu) {
        return await interaction.reply({
          content: "selectMenu not handled. Please contact the devs!",
          ephemeral: true,
        });
      } else if (
        selectMenu.permissions &&
        !interaction.member.permissions.has(selectMenu.permissions)
      ) {
        return await interaction.reply({
          content:
            "You do not have the required permissions to use this selectMenu.",
          ephemeral: true,
        });
      } else if (
        selectMenu.devOnly &&
        !config.devs.includes(interaction.member.id)
      ) {
        return await interaction.reply({
          content: "This selectMenu is only available for developers.",
          ephemeral: true,
        });
      } else if (
        selectMenu.ownerOnly &&
        interaction.guild.ownerId !== interaction.member.id
      ) {
        return await interaction.reply({
          content: "This selectMenu is only available for the guild owner.",
          ephemeral: true,
        });
      }

      try {
        await interaction.deferReply({ ephemeral: true });
        await selectMenu.run(client, interaction);
      } catch (err) {
        console.log(err);
        await interaction.reply({
          content: `An error occured. Please contact the devs! Error: \`\`\`${err}\`\`\``,
          ephemeral: true,
        });
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
    } else  if (!interaction.isCommand()) return;
    const command = interaction.client.slashcommands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }

  },
};
