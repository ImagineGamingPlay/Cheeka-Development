//for env
require("dotenv").config();

const { Client, Collection } = require("discord.js");

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

//Ready Event
client.on("ready", async () => {
  console.log(`${client.user.username} is online.`);
  client.user.setPresence({ activities: [{name: 'Subscribe to IGP'}]});
});

client.login(process.env.token);
