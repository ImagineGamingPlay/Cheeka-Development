const {MessageEmbed} = require('discord.js');
const warningsSchema = require('../../schema/warnings');
module.exports = {
  name: 'warn',
  description: 'configure a warning for a user',
  aliases: [],
  permissions: ['KICK_MEMBERS'],
  roles: [],
  devOnly: false,
  ownerOnly: false,
  deleteTrigger: true,
  run: async ({client, message, args}) => {
    const method = args[0]; // ? Checking: Done

    if (!method) {
      return client.config.errEmbed(
        message,
        'Invalid Syntax!',
        'Please mention a user to warn or specify a method. Available methods: `edit`, `remove`, `list`',
      );
    }

    let targetId; // ? Checking: not required;
    let userCheck; // ? Checking: Not required
    let ifUserExists = message.guild.members.cache.get(args[0]);
    if (args[0].includes('<@') && args[0].includes('>')) {
      userCheck = true;
      targetId = args[0].replace(/[<@>]/g, '');
    } else if (ifUserExists) {
      userCheck = true;
      targetId = args[0];
    }

    const warnMember = () => {
      const reason = args.slice(1).join(' ') || 'No reason provided'; // ? Checking: Not required
      const target = client.users.cache.get(targetId); // ? Checking: Cannot be undefined
      new warningsSchema({
        guildId: message.guild.id,
        userId: targetId,
        executerId: message.author.id,
        reason: reason,
        date: new Date(message.createdTimestamp).toLocaleDateString(),
      }).save();

      const warnAddedEmbed = {
        author: {
          name: target.tag,
          icon_url: target.displayAvatarURL({dynamic: true}),
        },
        timestamp: new Date(),
        color: client.config.colors.success,
        title: `${target.username} has been warned!`,
        description: `**User:** ${target} | ||${target.id}||\n**Reason:** ${reason}\n**Executer:** ${message.author} | ||${message.author.id}||`,
      };
      const warnAddedEmbedForDm = {
        author: {
          name: message.guild.name,
          icon_url: message.guild.iconURL({dynamic: true}),
        },
        timestamp: new Date(),
        color: client.config.colors.warning,
        title: `You have been warned!`,
        description: `You have been **warned** in **${message.guild.name}**\n**Reason:** ${reason}\nIf you feel like this was an mistake/misunderstanding, please reply to the bot.`,
        footer: {
          text: 'Please retain from repeating this activity in the future!.',
        },
      };
      message.reply({embeds: [warnAddedEmbed]});
      target.send({embeds: [warnAddedEmbedForDm]});
    };

    const listWarnings = () => {
      const target =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]); // ? Checking: Done

      if (!target) {
        return client.config.errEmbed(
          message,
          'Invalid Syntax!',
          'Please mention a user to check warnings of or specify a user id.',
        );
      }
      const warnings = warningsSchema.find(
        {
          guildId: message.guild.id,
          userId: target.id,
        },
        async (err, data) => {
          if (err) console.log(err);
          if (data) {
            const listEmbed = new MessageEmbed()
              .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL({dynamic: true}),
              })
              .setTitle(`${target.user.username}'s Warnings`)
              .setColor(client.config.colors.primary)
              .setTimestamp()
              .setDescription(
                `${data
                  .map(
                    (d, i) =>
                      `**${i + 1}. Warning**\n**Warn ID:** ${
                        d._id
                      }\n**Warned by:** ${message.guild.members.cache.get(
                        d.executerId,
                      )} | ||${d.executerId}||\n**Date:** ${
                        d.date
                      }\n**Reason:** ${d.reason}\n\n`,
                  )
                  .join(' ')}`,
              );

            message.reply({embeds: [listEmbed]});
          } else {
            const noWarningsEmbed = new MessageEmbed()
              .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL({dynamic: true}),
              })
              .setTitle(`${target.user.username} has no warnings!`)
              .setColor(client.config.colors.error)
              .setTimestamp();

            message.reply({embeds: [noWarningsEmbed]});
          }
        },
      );
    };

    const deleteWarning = () => {
      const target =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]); // ? Checking: Done
      const warnId = args[2]; // ? Checking: Done
      const reasonForDelete = args.slice(3).join(' ') || 'No reason provided'; // ? Checking: Done

      if (!target) {
        return client.config.errEmbed(
          message,
          'Invalid User',
          'Please mention a user to remove a warning from.',
        );
      }
      if (!warnId) {
        return client.config.errEmbed(
          message,
          'Invalid Warn ID',
          'Please specify a warn ID to remove.',
        );
      }

      warningsSchema.findOneAndDelete(
        {
          _id: warnId,
          guildId: message.guild.id,
          userId: target.id,
        },
        async (err, data) => {
          if (err) client.config.handleError(message, err);
          if (data) {
            const warnDeleteEmbed = new MessageEmbed()
              .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL({dynamic: true}),
              })
              .setFooter({
                text: `Warn ID: ${data._id}`,
                iconURL: target.displayAvatarURL({dynamic: true}),
              })
              .setTimestamp()
              .setColor(client.config.colors.success)
              .setTitle(`${target.user.username}'s Warning Deleted`)
              .setDescription(
                `**Warn ID:** ${data._id}\n**Reason For Warn:** ${data.reason}\n**Deleted By:** ${message.author} | ||${message.author.id}||\n**Reason For Delete:** ${reasonForDelete}`,
              );

            const warnDeleteDmEmbed = new MessageEmbed()
              .setAuthor({
                name: message.guild.name,
                iconURL: message.guild.iconURL({dynamic: true}),
              })
              .setFooter({
                text: `IGP staff team`,
                iconURL: message.guild.iconURL({dynamic: true}),
              })
              .setTimestamp()
              .setColor(client.config.colors.success)
              .setTitle('Your Warning Has Been Removed!')
              .setDescription(
                `Hello ${target.user.username}! You received this message as an alert to inform you that your warning for ${data.reason} has been removed.\n\n
								**Warn ID:** ${data._id}\n
								**Reason For Delete:** ${reasonForDelete}`,
              );

            message.reply({embeds: [warnDeleteEmbed]});
            target.send({embeds: [warnDeleteDmEmbed]});
          } else if (!data) {
            return client.config.errEmbed(
              message,
              'Invalid Warn ID',
              'Please specify a valid warn ID.',
            );
          }
        },
      );
    };

    const editWarning = () => {
      const warnId = args[2]; // ? Checking: Done
      const target =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[1]); // ? Checking: Done
      const newReason = args.slice(3).join(' '); // ? Checking: Not required

      if (!target) {
        return client.config.errEmbed(
          message,
          'Invalid User',
          'Please mention a user to edit a warning from.',
        );
      }
      if (!warnId) {
        return client.config.errEmbed(
          message,
          'Invalid Warn ID',
          'Please specify a warn ID to edit.',
        );
      }
      if (!newReason) {
        return client.config.errEmbed(
          message,
          'New Reason Not Given',
          'Please specify a new reason to edit!',
        );
      }

      warningsSchema.findOneAndUpdate(
        {
          _id: warnId,
          guildId: message.guild.id,
          userId: target.id,
        },
        {reason: newReason},
        async (err, data) => {
          if (err) return client.config.handleError(message, err);
          if (data) {
            const embed = new MessageEmbed()
              .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL({dynamic: true}),
              })
              .setTimestamp()
              .setTitle(`${target.user.username}'s Warning Edited`)
              .setColor(client.config.colors.success)
              .setDescription(
                `**Warn ID:** ${data._id}\n**Old Reason:** ${data.reason}\n**Edited By: ${message.author} | ||${message.author.id}||**\n**New Reason:** ${newReason}`,
              );

            message.reply({embeds: [embed]});
          } else if (!data) {
            return client.config.errEmbed(
              message,
              'Invalid Warn ID',
              'Please specify a valid warn ID.',
            );
          }
        },
      );
    };

    if (userCheck) return warnMember(); // Checking if a member is mentioned or not
    if (method == 'list') return listWarnings();
    if (method == 'remove') return deleteWarning();
    if (method == 'edit') return editWarning();
  },
};
