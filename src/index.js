const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require("fs");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const client = (global.client = new Client({
  intents: 32767,
  allowedMentions: { parse: ["users"] },
}));

/* Config Files (public) */
const c = (global.c = require("./jsons/channels.json"));
const config = (global.config = require("../config.json"));

module.exports = { client };

require("./handlers/events");
require("./handlers/commands");
require("./handlers/mongoose");

client.login(process.env.token).catch((e) => console.log(e));

//<------------- PROCESS ERROR HANDLING ------------->
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
//<----------------PROCESS ERROR HANDLING END----------------->
