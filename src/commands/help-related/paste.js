const { MessageEmbed } = require('discord.js');
const { CommandStructure } = require('../../structure/CommandStructure');
const fetch = require('node-fetch');
const prettier = require('prettier');
const { create, get, url } = require('sourcebin');

module.exports = {
  name: 'paste',
  description: 'Pastebin a replied message.',
  category: 'Help',
  cooldown: 20,
  /**
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({ client, message, args }) => {
    // Make sure that the user has replied to some message
    try {
      let repliedMessage = await message.fetchReference().catch(() => { });
      if (!repliedMessage) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor('RED')
              .setDescription(`You must reply to a message!`),
          ],
        });
      }

      let content = repliedMessage.content
        .replace('```js', '')
        .replace('```', '');

      // Check if the message consist of a attachment that could be valid text
      if (repliedMessage.attachments.size > 0) {
        let attachment = repliedMessage.attachments.first();
        if (
          attachment.url.endsWith('.png') ||
          attachment.url.endsWith('.jpg')
        ) {
          return message.channel.send({
            embeds: [
              new MessageEmbed()
                .setColor('RED')
                .setDescription(
                  `You can't paste this message because it contains an image!`,
                ),
            ],
          });
        }
        if (
          attachment.url.endsWith('.txt') ||
          attachment.url.endsWith('.js') ||
          attachment.url.endsWith('.ts')
        ) {
          // Read the buffer and try to convert it to text
          try {
            content = await fetch(attachment.url).then(a => a.text());
          } catch (e) {
            return message.channel.send({
              embeds: [
                new MessageEmbed()
                  .setColor('RED')
                  .setDescription(
                    `I can't paste this message because it isn't a valid text.!`,
                  ),
              ],
            });
          }
        }
      }

      // Make sure content is actually set
      if (!content || content.length < 1) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor('RED')
              .setDescription(
                `I can't paste this message because it isn't a valid text!`,
              ),
          ],
        });
      }

      // Making the content into a source bin
      let url = await create({
        title: "code",
        files: [
          {
            content: content
          }
        ]
      })
      console.log(url);
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('GREEN')
            .setTitle('Paste')
            .setDescription(`[Click here to view the paste](${url})`)
            .addField('Requested by', message.author.tag)
            .addField('Requested in', message.channel.toString())
            .setTimestamp(),
        ],
      });
    } catch (e) {
      // Reply with a message embed saying you must reply to a message
      console.log(e);
    }
  },
};
