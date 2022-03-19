const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "servercount",
    description: "view the number of servers the bot is in, and their names.",
    aliases: ["sc"],
    permission: ["SEND_MESSAGES"],
    run: async ({ client, message, args }) => {
        var guilds = []
        client.guilds.cache.forEach(guild => {
            guilds.push(guild.name)
        })
        const a = new MessageEmbed()
            .setAuthor('Servers i\'m in', client.user.displayAvatarURL())
            .setDescription(guilds.join('\n'))
            .setFooter(`Currently in ${client.guilds.cache.size} servers.`)
        message.reply({ embeds: [a] })
    },
};