//Snipe Command
const { MessageEmbed } = require("discord.js");

module.exports ={
    name: "snipe",
    category: "Moderation",
    description: "Snipe a message.",
    devCmd: false,
    disabledChannel: [],
    guildOnly:true,
    
    /**
     * @param client {Client} A discord.js client
     * @param message {Message} A discord.js message
     * @param args {Array} A array of the arguments passed to the command
     * @returns {Promise<*>} Returns a promise that might return anything
     *  
     */
    run: async ({ client, message, args }) => {
    //fetch the snipes
    // if(!config.devs.includes(message.author.id) || !message.member.permissions.has('MANAGE_MESSAGES')) return message.channel.send("You don't have permission to use this command!");
    const channel = message.mentions?.channels?.first() ?? message.guild?.channels?.cache?.get(args[0]) ?? message.channel;
    const snipes = client.snipes.get(channel.id);
    if (!snipes) return message.channel.send(`Nothing to snipe in ${channel}`);
    let content = snipes?.message ? `\`${snipes?.message}\``:'`No content`';
    const embed = new MessageEmbed()
        .setTitle(`🔫 Snipe in ${channel.name}`)
        .setColor("YELLOW")
        .setDescription(`*Content:*\n${content}`)
        .setAuthor({name:`${snipes.author?.tag}`,iconURL:snipes.author?.displayAvatarURL() ?? null})
        .setImage(snipes.attachment ?? null)
        .addField("Time", `${new Date(snipes.time).toUTCString()}`);
    await message.channel.send({ embeds:[embed] });

    }
}