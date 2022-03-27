//Making a discordjs snipe command from scratch;
const {Collection} = require('discord.js');
client.snipes = new Collection();

module.exports={
    name: "messageDelete",
    async execute(message, client) {
        //collect data and add to snipes
        if (message.author?.bot) return;
        client.snipes.set(message.channel.id, {
            message: message.content,
            author: message.author,
            channel: message.channel,
            time: Date.now(),
            attachment: message.attachments?.first()?.url || null,        
        });
    }
}