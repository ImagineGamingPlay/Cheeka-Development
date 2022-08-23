const {MessageEmbed} = require('discord.js');
const puppeteer = require('puppeteer');
const {Worker, MessageChannel} = require('node:worker_threads');
const path = require('path');
const {hashCache} = require('../../utils/Cache');
const {PostModel} = require('../../schema/postHash');

const client = require('../../index').client;
const config = require('../../../config.json');

module.exports = {
  // Time will be in milliseconds, run this every 40 minute
  time: 1000 * 60 * 40,
  /**
   *
   * @param {client} client
   */
  run: async function (client) {
    let worker = new Worker(
      path.join(__dirname, '..', '..', '..', 'scrape.js'),
    );
    worker.on('message', messages => {
      messages.forEach(async message => {
        if (hashCache.has(message.hash)) return;
        hashCache.set(message.hash, message);
        client.channels.fetch(config);
        await PostModel.create(message);
        const channel = await client.channels.fetch(config.postsChannel);
        const embed = new MessageEmbed()
          .setColor('AQUA')
          .setTitle('New community post')
          .setAuthor({
            name: 'ImagineGamingPlay',
            iconURL:
              'https://yt3.ggpht.com/Cn6QOwGoZqOoY2XeyDD7AG5029KGQxkiH85EBGscjdBk7puGNChGW62H38iVql8O8o6X6oy54g=s176-c-k-c0x00ffffff-no-rj',
            url: 'https://www.youtube.com/c/ImagineGamingPlay',
          })
          .setDescription(message.text)
          .setTimestamp();
        if (message.img) embed.setImage(message.img);
        channel.send({
          embeds: [embed],
        });
      });
    });
  },
};
