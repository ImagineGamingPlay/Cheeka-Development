const fs = require("fs");

const buttonFolders = fs.readdirSync("./src/buttons").forEach((folder) => {
  let buttons = fs
    .readdirSync(`./src/buttons/${folder}`)
    .filter((file) => file.endsWith(".js"));

  buttons.forEach((f) => {
    const button = require(`../buttons/${folder}/${f}`);
    client.buttons.set(button.id, button);
  });
});
