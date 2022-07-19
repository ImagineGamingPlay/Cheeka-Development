//Making a discordjs snipe command from scratch;
const {Collection} = require('discord.js');
client.snipes = new Collection();

module.exports={
    name: "messageDelete",
    async execute(message, client) {
        if(message.author?.bot) return
        //collect data and add to snipes
        let snipes = client.snipes.get(message.channel.id) ?? []
        snipes.push({
            message: message.content,
            author: message.author,
            time: Date.now(),
            attachment: message.attachments,        
        })
        client.snipes.set(message.channel.id, snipes);
    }
}
