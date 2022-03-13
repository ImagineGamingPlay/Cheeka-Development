module.exports= {
    name:'kick',
    description:"Kicks a member",
    aliases:['k'],
    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client,message,args)=>{
        try {
            if(!message.member.permissions.has('KICK_MEMBERS') || !message.guild.me.permissions.has("KICK_MEMBERS")) return;
            let member = message.mentions.members.first();
            if (!member) await message.reply("You need to mention someone to kick!");
            const reason = args.slice(1).join(' ')
            if(!reason) await message.reply("No reason was given");
            await member.send(`You were kicked of ${message.guild.name} for **${reason}**`)
            await member.kick();
            await message.reply(`${member.user.tag} was kicked!`)
        } catch(e) {
            message.reply(`${e}`)
        }
    }
}