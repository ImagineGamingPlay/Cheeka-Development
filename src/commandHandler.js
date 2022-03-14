const util = require("util");
const { glob } = require("glob");

module.exports = async (client) => {
  const command = await util.promisify(glob)(
    `${process.cwd()}/src/commands/**/*.js`
  );

  command.map((cmd) => {
    const file = require(cmd);
    const comms = cmd.split("/");
    const dir = comms[comms.length - 2];

    if (file.name) {
      let property = { dir, ...file };
      client.commands.set(file.name, property);
    }
  });

  const events = await util.promisify(glob)(`${process.cwd()}/src/events/*.js`);

  events.map((event) => require(event));
};
