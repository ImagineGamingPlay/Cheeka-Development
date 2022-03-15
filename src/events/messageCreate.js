module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author?.bot || !message.guild || !message.content) return;
    if (!message.content.toLowerCase().startsWith(config.prefix)) return;

    const [cmd, ...args] = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/ +/g);

    const command =
      client.commands.get(cmd.toLowerCase()) ||
      client.commands.find((command) =>
        command.aliases?.includes(cmd.toLowerCase())
      );

    if (!command) return;
    await command.run(client, message, args);
  },
};
