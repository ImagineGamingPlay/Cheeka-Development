const { Client , Message, MessageEmbed} = require("discord.js")
const Blacklist = require('../../schema/blacklist.js')
module.exports = {
  name:"blacklist",
  description:"Blacklist users from using a command.",
  devCmd:true,
  run:async(client,message,args) => {

  const query = args[0].toLowerCase()
  if(!query) return message.channel.send("Please provide a query.\nAdd-> ['add','create'] \nRemove -> ['remove','delete']")
  const userId = message.mentions?.members?.first()?.id ?? message.guild?.members?.cache?.get(args[1]) ?? await client.users?.fetch(args[1]).then(async(user)=>{return user?.id});
  if(!userId) return message.channel.send('Please provide a valid user to blacklist!');

  if(query in ['add','create']) {

      await Blacklist.findOne({UserId: userId},async(error,data)=>{
        if(error) console.log(error);
        if(data) {
            return message.reply({embeds:[
                new MessageEmbed({
                    title:'User Already Blacklisted.',
                    description:`${userId} is already blacklisted form using any commands.`,
                    color:"GOLD"
                })
            ]})
        } else{
            new Blacklist({
                UserId:userId
            }).save()

            return message.reply('User successfully blacklisted.')

        }
      })
  } else if(query in ['remove','delete']) {
      await Blacklist.findOne({UserId:userId},async(error,data)=>{
          if(error) console.log(error);
          if(data) {
              data.delete()
              return message.reply('User successfully blacklisted.');
          } else {
              return message.reply("User is not blacklisted!!");
          }
      })
  } else {
      return message.reply("Invalid query.")
  }
}
}