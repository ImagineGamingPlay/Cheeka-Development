//Making a discordjs snipe command from scratch;
const { Collection } = require("discord.js");
client.eSnipe = new Collection();

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage, client) {
    //collect data and add to snipes
    if (newMessage.author?.bot) return;
    const division = 1950; //as an embed description can only have upto 4096 characters, we are dividing it to fit both old and new messages
    const orginalMsg =
      oldMessage.content.slice(0, division) +
      (oldMessage.content.length > division ? " ..." : ""); //this line makes that if the content is more than 1950 characters, it'll add an ... at the end
    const editedMsg =
      newMessage.content.slice(0, division) +
      (newMessage.content.length > division ? " ..." : ""); //does the same as above but for edited message
    // Set the message to eSnipe
    client.eSnipe.set(newMessage.channel.id, {
      prevs: orginalMsg,
      currs: editedMsg,
      time: Date.now(),
      author: newMessage.author,
      channel: newMessage.channel,
    });
  },
};
