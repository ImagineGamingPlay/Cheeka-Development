const { MessageEmbed } = require("discord.js");

process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p);
  client.channels.cache.get("958000637944164462").send({
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
  client.channels.cache.get("958000637944164462").send({
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
  client.channels.cache.get("958000637944164462").send({
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
  client.channels.cache.get("958000637944164462").send({
    embeds: [
      new MessageEmbed()
        .setTitle("Multiple Resolves")
        .setDescription(`${type}`)
        .setColor("RED")
        .addField("Stack", "```js\n" + reason.stack + "```"),
    ],
  });
});
