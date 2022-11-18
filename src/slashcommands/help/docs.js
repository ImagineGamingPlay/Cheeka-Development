const { SlashCommandBuilder } = require('@discordjs/builders');
const {
    MessageEmbed,
    MessageActionRow,
    MessageSelectMenu,
} = require('discord.js');

const Docs = require('discord.js-docs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('docs')
        .setDescription('Documentation')
        .addStringOption(option => 
            option.setName('topic')
            .setDescription("Documentation topic")
            .setRequired(true)
        ),
    async execute(interaction) {
        const query = await interaction.options.getString('topic')
        const replaceDisco = str => {
            str
              .replace(/docs\/disco/g, `docs/discord.js/${branch}`)
              .replace(/ \(disco\)/g, '');
      
            return str;
          };
  
         //s const query = args.join(' ');
          const branch = 'stable';
          const doc = await Docs.fetch(branch).catch(() => null);
      
          if (!doc)
            return interaction.reply('Could not find the object/method/property.');
          const result = await doc.resolveEmbed(query);
      
          if (!result)
            return interaction.reply('Could not find that topic on the documentation.');
      
          const string = replaceDisco(JSON.stringify(result));
          const embed = JSON.parse(string);
      
          embed.author.url = `https://discord.js.org/#/docs/discord.js/${branch}/general/welcome`;
      
          const extra =
            '\n\nView more here: ' +
            /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
              .exec(embed.description)[0]
              .split(')')[0];
      
          if (!result)
      
            return interaction.reply('Could not find that topic on the documentation.');
      
          for (const field of embed.fields || []) {
            if (field.value.length >= 1024) {
              field.value = field.value.slice(0, 1024);
              const split = field.value.split(' ');
              let joined = split.join(' ');
      
              while (joined.length >= 1024 - extra.length) {
                split.pop();
               joined = split.join(' ');
              }
      
              field.value = joined + extra;
            }
          }
      
          if (
            embed.fields &&
            embed.fields[embed.fields.length - 1].value.startsWith('[View Source')
          ) {
            embed.fields.pop(); // Remove the last field which contains view source which has wrong url
          }
      
          interaction.reply({ embeds: [embed] });
    }
}