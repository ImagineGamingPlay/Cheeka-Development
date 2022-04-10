module.exports = {
  id: "test-button",
  run: async (client, interaction) => {
    interaction.reply(`${client.user} Says: Button handler works! :D`);
  },
};
