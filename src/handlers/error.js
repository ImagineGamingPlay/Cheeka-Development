const { MessageEmbed } = require("discord.js");
const channel = client.channels.cache.get("958000637944164462");

process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p);
  channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Unhandled Rejection")
        .setDescription(`${reason}`)
        .setColor("RED")
        .addField("Stack", "```js\n" + reason.stack + "```"),
    ],
  });
});
process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
  channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Uncaught Exception")
        .setDescription(`${err}`)
        .setColor("RED")
        .addField("Stack", "```js\n" + err.stack + "```"),
    ],
  });
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
  channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Uncaught Exception")
        .setDescription(`${err}`)
        .setColor("RED")
        .addField("Stack", "```js\n" + err.stack + "```"),
    ],
  });
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(type, promise, reason);
  channel.send({
    embeds: [
      new MessageEmbed()
        .setTitle("Multiple Resolves")
        .setDescription(`${type}`)
        .setColor("RED")
        .addField("Stack", "```js\n" + reason.stack + "```"),
    ],
  });
});
