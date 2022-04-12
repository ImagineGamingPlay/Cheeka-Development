const { Message } = require("discord.js");
const CommandStructure =
  require("../../structure/CommandStructure").CommandStructure;
module.exports = {
  name: "ban",
  description: "Bans a member",
  permissions: ["BAN_MEMBERS"],
  aliases: ["b"],
  category: "Moderation",
  disabledChannel: [],
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({ client, message, args }) => {},
};
