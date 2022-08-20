const devs = [
  '820502577783373884',
  '453457425429692417',
  '881113828195205131',
  '816253376962625537',
  '756143693932658818',
  '657951960397381684',
  '459342334564237323',
];
const {exec} = require('child_process');
const {MessageEmbed} = require('discord.js');
const CommandStructure =
  require('../../structure/CommandStructure').CommandStructure;

module.exports = {
  name: 'gitpull',
  description: 'Pull latest code from github.',
  aliases: ['gp'],
  disabledChannel: [],
  category: 'Owner',
  /**
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
   */
  run: async ({client, message, args}) => {
    if (devs.includes(message.author.id)) {
      const command = 'git pull';
      exec(command, async (err, stdout, stderr) => {
        if (err) return console.log(err);
        let res = stdout || stderr;
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle('Git Pull')
              .setColor('#171515')
              .setDescription(`\`\`\`js\n${res.slice(0, 2000)}\n\`\`\``),
          ],
        });
      });
    } else
      return message.reply(
        'Only the developers of cheeku can run this command.',
      );
  },
};
