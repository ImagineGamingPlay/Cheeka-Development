const { Client, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const client = (global.client = new Client({ intents: 32767 }));

//functions
function filesConfig(path, ending) {
  return fs.readdirSync(path).filter((fileName) => fileName.endsWith(ending));
}

/* Config Files (public) */
const config = (global.config = require("../config.json"));

//Exporting client object
module.exports = { client };

require("./mongoose.js");

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

//<------- COMMAND HANDLER START ------->
client.commands = new Collection();

const commandFolders = fs.readdirSync("./src/commands").forEach((folder) => {
  let commands = filesConfig(`./src/commands/${folder}`, ".js");

  commands.forEach((f) => {
    const command = require(`./commands/${folder}/${f}`);
    client.commands.set(command.name, command);
  });
});

console.log(`Successfully loaded ${client.commands.size} commands!`);
//<------- COMMAND HANDLER END ------->

client
  .login(process.env.token)
  .then((r) => console.log(`Successfully logged in as ${client.user.tag}!`))
  .catch((e) => console.log(e));

//<------------- PROCESS ERROR HANDLING ------------->
process.on("unhandledRejection", (reason, p) => {
  console.log(reason, p);
});
process.on("uncaughtException", (err, origin) => {
  console.log(err, origin);
});
process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(err, origin);
});
process.on("multipleResolves", (type, promise, reason) => {
  console.log(type, promise, reason);
});
//<----------------PROCESS ERROR HANDLING END----------------->
