//for env
require("dotenv").config();

const { Client, Collection } = require("discord.js");
const fs = require("fs");

const client = (global.client = new Client({ intents: 32767 }));

/* Config Files (public) */
const config = (global.config = require("../config.json"));

//Making commands
client.commands = new Collection();

//Exporting client object
module.exports = { client };

require("./mongoose.js");

//requiring handler
const handler = require("./commandHandler");
handler(client);

//<------- EVENT HANDLER START ------->
const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`../src/events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}
//<------- EVENT HANDLER END ------->
client.login(process.env.token);