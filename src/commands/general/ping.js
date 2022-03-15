module.exports = {
  name: "ping",
  description: "Check for the bots latency",
  aliases: ["pong"],
  permissions: ["ADMINSTRATOR"],
  run: async ({ client, message, args }) => {
    message.reply(`Latency is ${client.ws.ping} ms`);
  },
};
