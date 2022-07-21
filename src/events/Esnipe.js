//Making a discordjs snipe command from scratch;
const { Collection } = require("discord.js");
client.eSnipe = new Collection();

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    //collect data and add to snipes
    if(newMessage.author?.bot || oldMessage.editedTimestamp === newMessage.editedTimestamp) return;
    // Set the message to eSnipe
    let eSnipes = client.eSnipe.get(newMessage.channel.id) ?? []
    eSnipes.unshift({
      before: {
        content: oldMessage.content,
        attachments: oldMessage.attachments
      },
      after: {
        content: newMessage.content,
        attachments: newMessage.attachments
      },
      time: Date.now(),
      author: newMessage.author
    })
    client.eSnipe.set(newMessage.channel.id, eSnipes);
  },
};
