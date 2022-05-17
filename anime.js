const Discord = require("discord.js");

const malScraper = require('mal-scraper');


module.exports = {
  name: "anime",
  category: "info",
  description: "Get info about the required Anime.",
  usage: "%anime [Anime Name]",
  run: async (client, message, args) => {
    //command
    const search = `${args}`;
    if (!search)
      return message.reply('Please Add Your Search Query');
  if(!message.channel.nsfw) {
      return message.reply("Please use this in a NSFW Channel.")
      
    } else {
    malScraper.getInfoFromName(search)
      .then((data) => {
        const malEmbed = new Discord.MessageEmbed()
          .setAuthor(`My Anime List search result for ${args}`.split(',').join(' '))
          .setThumbnail("https://cdn.aniblogtracker.com/live/20210518/1621373643.12781.37485.gif")
          .setColor('RANDOM') //What ever u want color!
          .addField('Premiered', `\`${data.premiered}\``, true)
          .addField('Broadcast', `\`${data.broadcast}\``, true)
          .addField('Genres', `\`${data.genres}\``, true)
          .addField('English Title', `\`${data.englishTitle}\``, true)
          .addField('Japanese Title', `\`${data.japaneseTitle}\``, true)
          .addField('Type', `\`${data.type}\``, true)
          .addField('Episodes', `\`${data.episodes}\``, true)
          .addField('Rating', `\`${data.rating}\``, true)
          .addField('Aired', `\`${data.aired}\``, true)
          .addField('Score', `\`${data.score}\``, true)
          .addField('Favorite', `\`${data.favorites}\``, true)
          .addField('Ranked', `\`${data.ranked}\``, true)
          .addField('Duration', `\`${data.duration}\``, true)
          .addField('Studios', `\`${data.studios}\``, true)
          .addField('Popularity', `\`${data.popularity}\``, true)
          .addField('Members', `\`${data.members}\``, true)
          .addField('Score Stats', `\`${data.scoreStats}\``, true)
          .addField('Source', `\`${data.source}\``, true)
          .addField('Synonyms', `\`${data.synonyms}\``, true)
          .addField('Status', `\`${data.status}\``, true)
          .addField('Identifier', `\`${data.id}\``, true)
          .addField('Link', data.url, true)
          .setTimestamp()
          .setFooter(`Requested ${message.member.displayName}`,  message.author.displayAvatarURL({ dynamic: true }))

       message.channel.send({embeds : [malEmbed]});


      })
  }
  }
};
