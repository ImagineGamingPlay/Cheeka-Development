const { MessageEmbed } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
  name: "meme",
  description:
    "get a meme out from r/memes and sends it in the required channel",
  category: "Fun",
  cooldown: 5,
  aliases: ["memes", "meeme"],
  run: async ({ client, message, args }) => {
    // https://meme-api.herokuapp.com/gimme use this to generate memes with node fetch
    const body = await (
      await fetch("https://meme-api.herokuapp.com/gimme")
    ).json();
    /**
     * {"postLink":"https://redd.it/tv8rj4","subreddit":"me_irl","title":"me_irl","url":"https://i.redd.it/xd8ijex7h8r81.png","nsfw":false,"spoiler":false,"author":"memecream_mc","ups":250,"preview":["https://preview.redd.it/xd8ijex7h8r81.png?width=108\u0026crop=smart\u0026auto=webp\u0026s=2a068f3b2a3248d5f1448878beda8a8c3c6590bb","https://preview.redd.it/xd8ijex7h8r81.png?width=216\u0026crop=smart\u0026auto=webp\u0026s=a51e8157ed705ca21f851f632adb8d7447796ec3","https://preview.redd.it/xd8ijex7h8r81.png?width=320\u0026crop=smart\u0026auto=webp\u0026s=4022932d2fa56c0dfe43e8da2d90ab88ba9b3d57","https://preview.redd.it/xd8ijex7h8r81.png?width=640\u0026crop=smart\u0026auto=webp\u0026s=4a5bba0334ae492bf9beccc1fbdfbbb594a57da5"]}
     * Json format will be like this,
     * set color to RANDOM
     * set title to title
     * description to description
     * and set title url to the postLink
     * also set the url to setImage
     * and add author at top saying the authors name
     */
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(body.title)
      .setDescription("Fetched from r/" + body.subreddit)
      .setImage(body.url)
      .setAuthor({
        name: body.author,
      })
      .setURL(body.postLink);
    message.channel.send({ embeds: [embed] });
  },
};
