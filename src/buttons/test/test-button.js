module.exports = {
  id: "test-button",
  run: async (client, interaction) => {
    interaction.editReply(`${client.user} Says: Button handler works! :D`);
  },
};
