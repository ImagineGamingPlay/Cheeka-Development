const { Collection } = require("discord.js");
const fs = require("fs");

client.commands = new Collection();

const commandFolders = fs.readdirSync("./src/commands").forEach((folder) => {
  // let commands = filesConfig(`./src/commands/${folder}`, ".js");
  let commands = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith(".js"));

  commands.forEach((f) => {
    const command = require(`../commands/${folder}/${f}`);
    client.commands.set(command.name, command);
  });
});

console.log(`Successfully loaded ${client.commands.size} commands!`);
