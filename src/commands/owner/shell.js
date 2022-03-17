const {exec} = require("child_process");
const {MessageEmbed} = require('discord.js')

module.exports = {
  name: "shell",
  description: "Execute shell commands from discord.",
  aliases: ["run"],
  devCmd: true,
  run: async({client,message,args}) =>{
    if(config.devs.includes(message.author.id)) {

      const command = args.join(" ");
      if(!command) return message.reply('Provide the shell command.');
     exec(command, async(err,res) => {
        if(err) return console.log(err);
        message.channel.send({
            embeds: [new MessageEmbed()
                .setTitle("Shell")
                .setColor('AQUA')
                .setDescription(`\`\`\`js\n${res.slice(0,2000)}\n\`\`\``)]
        })
      })

    } else return message.reply('Only the developers of cheeku can run this command.');
  }
}