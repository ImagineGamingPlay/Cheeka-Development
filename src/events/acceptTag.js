const {
  MessageEmbed,
  Client,
  ButtonInteraction,
  Permissions,
} = require("discord.js");
const tags = require("../schema/tags");
const { tagsCache } = require("../utils/Cache");

module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   * @param {Client} client
   * @returns
   */
  async execute(interaction, client) {
    if (!interaction.isButton()) return;
    // Make sure that the user has KICK_MEMBERS permission
    await interaction.deferReply({
      ephemeral: true,
    });
    // Get the ID and split it at -, the first one might be a a or d, a is accept, d is deny and the second one is the tag id
    let [enable, id] = interaction.customId.split("-");
    // From the tagCache (a map) find a tag in values by checking _id which is a mongoose object id
    let tag = Array.from(tagsCache.values()).find(
      (tag) => tag._id?.valueOf() === id
    );
    // If the tag is not found, return
    if (!tag) return await interaction.editReply("Tag not found");
    // If the tag is found, check if the user has the permission to accept or deny the tag
    if (
      !interaction.message.member.permissions.has(
        Permissions.FLAGS.KICK_MEMBERS
      )
    ) {
      return interaction.editReply("You don't have permission to do that");
    }
    // If the user has the permission, check if the tag is already accepted or denied
    if (tag.enabled) {
      return interaction.editReply("Tag is already accepted");
    }
    // If the tag is not enabled, check if the first value is a a or d
    if (enable === "a") {
      // If the first value is a a, accept the tag by enabling it
      tag.enabled = true;
      tag.verifiedAt = new Date();
      tag.verifiedBy = interaction.member.id;
      tagsCache.set(tag.name, tag);
      // Send a message to the channel that the tag was accepted
      let embed = new MessageEmbed()
        .setColor("#36393F")
        .setTitle("Tag Accepted")
        .setDescription(
          `Tag **${tag.name}** was accepted by <@${interaction.member.id}>`
        )
        .addField("Tag", tag.name)
        .addField("Verified at", tag.verifiedAt.toString())
        .setTimestamp();
      await interaction.editReply({
        embeds: [embed],
      });
      // Send the message the tag owner
      let owner = client.users.cache.get(tag.owner);
      if (owner) {
        owner
          .send({
            embeds: [embed],
          })
          .catch(() => {});
      }
      // Find the tag in the database and update it
      tags.findById(id).then((tag) => {
        tag.enabled = true;
        tag.verifiedAt = new Date();
        tag.verifiedBy = interaction.member.id;
        tag.save();
      });
      // Delete the interaction message
      interaction.message.delete();
    } else if (enable === "d") {
      // If the first value is a d, deny the tag by deleteing it
      tagsCache.delete(tag.name);
      // Send a message to the channel that the tag was denied
      let embed = new MessageEmbed()
        .setColor("RED")
        .setTitle("Tag Denied")
        .setDescription(
          `Tag **${tag.name}** was denied by <@${interaction.member.id}>`
        )
        .addField("Tag", tag.name)
        .setTimestamp();
      await interaction.editReply({
        embeds: [embed],
      });
      // Send the message the tag owner
      let owner = client.users.cache.get(tag.owner);
      if (owner) {
        owner
          .send({
            embeds: [embed],
          })
          .catch(() => {});
      }
      await tags.findByIdAndDelete(id);
      await interaction.message.delete();
    }
  },
};
