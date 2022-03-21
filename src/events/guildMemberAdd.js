const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    async execute(member, client) {
        let welcomeMsgEmbed = new MessageEmbed()
            .setTitle("Welcome to the Server!")
            .setDescription(` Hey <@${member.id}>, welcome to the server!\n
        > **Read the rules in:** <#952514063148146690>\n
        > **Have fun chatting in:** <#952514063328489489>
        > **Get help in:** <#952514063328489485>`)
            .setColor("#36393F")

        member.guild.channels.cache.get("952514062942617649").send({
            content: `<@${member.id}>`,
            embeds: [welcomeMsgEmbed]
        });
    }
}