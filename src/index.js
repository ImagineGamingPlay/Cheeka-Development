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

client.commands = new Collection();
client.buttons = new Collection();

(async function () {
  await client.login(process.env.token);

  /* Config Files (public) */
  const c = (global.c = require("./jsons/channels.json"));
  const config = (global.config = require("../config.json"));
  module.exports = { client };

  const handlers = ["commands", "events", "mongoose", "error", "buttons"];

  for (const handler of handlers) {
    require(`./handlers/${handler}`);
  }
})().catch((err) => console.error(err));

console.log("Hello World! I'm ready to go!");
