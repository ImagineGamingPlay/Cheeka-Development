// Export a default client, message and args structure

const { Message } = require("discord.js");
const client = require("../index").client;

exports.CommandStructure = {
  client: client,
  /**
   * @type {Message}
   */
  message: Message,
  /**
   * @type {string[]} args
   */
  args: [],
};
