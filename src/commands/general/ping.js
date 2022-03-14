module.exports = {
  name: "ping",
  description: "Check for the bots latency",
  aliases: ["pong"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    message.reply(`Latency is ${client.ws.ping} ms`);
  },
};
