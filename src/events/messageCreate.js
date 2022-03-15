const { prefix, devs } = require("../../config.json")

module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ + /g)
    const cmd = args.shift().toLowerCase()
    const command = client.commands.get(cmd) ||client.commands.find(a => a.aliases && a.aliases.includes(cmd));

    if (!command) return;

    const member = message.member

    if (command.devCmd && !devs.includes(member.id)) {
      return message.reply("This command can only be used by developers!")
    }

    if (command.permissions && member.permissions.missing(command.permissions).length !== 0) {
      return message.reply("You donot have required permissions to use this command!")
    }

    try {
      await command.run({ client, message, args})
    } catch (err) {
      console.log(err)
    }
  },
};
