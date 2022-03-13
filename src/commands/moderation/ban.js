module.exports= {
    name:'ban',
    description:"Bans a member",
    aliases:['b'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run:async(client,message,args)=>{
        try {
            if(!message.member.permissions.has('BAN_MEMBERS') || !message.guild.me.permissions.has("BAN_MEMBERS")) return;
            let member = message.mentions.members.first();
            if (!member) await message.reply("You need to mention someone to ban!");
            const reason = args.slice(1).join(' ')
            if(!reason) await message.reply("No reason was given");
            await member.send(`You were banned of ${message.guild.name} for **${reason}**`)
            await member.ban();
            await message.reply(`${member.user.tag} was banned for **${reason}**!`)
        } catch(e) {
            message.reply(`${e}`)
        }
    }
}