const fs = require("fs");

const eventFiles = fs
  .readdirSync("./src/events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`../events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

const waitersFiles = fs
  .readdirSync("./src/events/waiters")
  .filter((file) => file.endsWith(".js"));
// So, create a setInterval() for each waiter file
for (const file of waitersFiles) {
  const waiter = require(`../events/waiters/${file}`);
  setInterval(() => {
    waiter.run(client);
  }, waiter.time);
}
