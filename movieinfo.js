const discord = require("discord.js");
const imdb = require("imdb-api");

module.exports = {
name: "imdb",
  description: "Gets the information of a Series or a Movie.",
  category: "info",
  usage: "%imdb [Name]",
  run: async (client, message, args) => {
    
    if(!args.length) {
      return message.channel.send("Please give me something to search.")
    }
     if(!message.channel.nsfw) {
      return message.reply("Please use this in a NSFW Channel.")
      
    } else {
    const imob = new imdb.Client({apiKey: "5e36f0db"}) 
    
    let movie = await imob.get({'name': args.join(" ")})
    
    let embed = new discord.MessageEmbed()
    .setTitle(movie.title)
    .setColor("RANDOM")
    .setThumbnail("https://media2.giphy.com/media/7zMsa4CDcXY7PEDNGN/giphy.gif")
    .setDescription(movie.plot)
    .setFooter(`Ratings: ${movie.rating}`)
    .addField("Country", movie.country, true)
    .addField("Languages", movie.languages, true)
    .addField("Type", movie.type, true);
    
    
message.channel.send({ embeds : [embed] });
    
    
    
  }

}
}
