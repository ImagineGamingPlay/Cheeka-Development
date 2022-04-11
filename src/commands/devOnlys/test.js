const { MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
  name: "test",
  description: "test",
  category: "Experimental",
  devCmd: true,
  run: async ({ client, message, args }) => {
    message.reply({
      content: "test",
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setLabel("test")
            .setCustomId("test-button")
            .setStyle("PRIMARY")
        ),
      ],
    });
  },
};
