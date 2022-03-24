const {
  MessageEmbed,
  GuildTextBasedChannel,
  Client,
  Message,
} = require("discord.js");
const { cRules, RulesChannel } = require("../../schema/rules");
const { rulesCache } = require("../../utils/Cache");
module.exports = {
  name: "rule",
  description: "Check a rules of the server.",
  aliases: ["rules"],
  disabledChannel: [],
  cooldown: 5,
  run: async function ({ client, message, args }) {
    const query = args[0]?.toLowerCase();
    // If query is a number
    if (!isNaN(query)) {
      const ruleId = parseInt(query);
      const rule = rulesCache.get(message.guildId)[ruleId - 1];
      if (!rule)
        return message.reply(
          "There is no rule by that index. Please provide a number between 1 and " +
            rulesCache.size
        );
      const ruleEmbed = new MessageEmbed().setColor("#0099ff").addField({
        name: rule.title,
        value: rule.description,
        inline: false,
      });
      return message.channel.send({
        embeds: [ruleEmbed],
      });
    }
    if (message.member.permissions.missing(["ADMINISTRATOR"]).length > 0) {
      return message.channel.send(
        "You need the `ADMINISTRATOR` permission to use this command."
      );
    }
    if (!query)
      return message.channel.send(
        "Please provide a query.\nAdd-> ['add','create'] \nRemove -> ['remove','delete'] \nSend -> ['send'] \nList -> ['list']"
      );
    /**
     * @type {GuildTextBasedChannel}
     */
    let channel = message.channel;
    if (query === "add" || query === "create") {
      // Ask the user for the rule title
      const title = await message.channel.send(
        "Please provide the title of the rule and the description."
      );
      // Wait for the user to type something
      const filter = (m) => m.author.id === message.author.id;
      try {
        const titleMsg = await channel.awaitMessages({
          filter,
          max: 2,
          time: 60000,
          errors: ["time"],
        });
        /**
         * @type {String}
         */
        const title = titleMsg.first().content;
        /**
         * @type {String}
         */
        const description = titleMsg.last().content;
        // Create the embed
        if (rulesCache.has(message.guildId)) {
          const rules = rulesCache.get(message.guildId);
          rules.push({
            title,
            description,
          });
          rulesCache.set(message.guildId, rules);
          await RulesChannel.updateOne(
            {
              guildId: message.guildId,
            },
            {
              rules: rules,
            }
          );
          return message.channel.send(`Rule added.`);
        } else {
          rulesCache.set(message.guildId, [
            {
              title,
              description,
            },
          ]);
          await RulesChannel.create({
            guildId: message.guildId,
            rules: [
              {
                title,
                description,
              },
            ],
          });
          return message.channel.send(`Rule added.`);
        }
      } catch (_e) {
        // say the process was canceled
        return message.channel.send(
          "Process cancelled, you didn't reply in time"
        );
      }
    } else if (query === "remove" || query === "delete") {
      // Ask the user for the rule title
      const title = await message.channel.send(
        "Please provide the title of the rule."
      );
      // Wait for the user to type something
      const filter = (m) => m.author.id === message.author.id;
      try {
        const titleMsg = await channel.awaitMessages({
          filter,
          max: 1,
          time: 60000,
          errors: ["time"],
        });
        /**
         * @type {String}
         */
        const title = titleMsg.first().content;
        // Create the embed
        if (rulesCache.has(message.guildId)) {
          const rules = rulesCache.get(message.guildId);
          const newRules = rules.filter((rule) => rule.title !== title);
          rulesCache.set(message.guildId, newRules);
          await RulesChannel.updateOne(
            {
              guildId: message.guildId,
            },
            {
              rules: newRules,
            }
          );
          return message.channel.send(`Rule removed.`);
        } else {
          return message.channel.send(`Rule not found.`);
        }
      } catch (_e) {
        // say the process was canceled
        return message.channel.send(
          "Process cancelled, you didn't reply in time"
        );
      }
    } else if (query === "send") {
    } else if (query === "list") {
      if (rulesCache.has(message.guildId)) {
        const rules = rulesCache.get(message.guildId);
        // Make each field for each rules, if there are more than 25 rules, split them into multiple embeds
        const fields = rules.map((rule) => {
          return {
            name: rule.title,
            value: rule.description,
            inline: false,
          };
        });
        // So, we'll have to create a new embed every 25 fields, for the first embed we'll have the title of "Rules" and description of "All the rules that must be followed are listed here"
        const embeds = [];
        let pointerEmbed = new MessageEmbed()
          .setTitle("Rules")
          .setDescription("All the rules that must be followed are listed here")
          .setColor("#0099ff");
        console.log(fields.length);
        let iPointer = 1;
        for (let i = 0; i < fields.length; i++) {
          if (pointerEmbed.fields.length >= 25) {
            embeds.push(pointerEmbed);
            pointerEmbed = new MessageEmbed().setColor("#0099ff");
          }
          pointerEmbed.addField(
            `${iPointer}) ${fields[i].name}`,
            fields[i].value,
            fields[i].inline
          );
          iPointer += 1;
        }
        embeds.push(pointerEmbed);
        console.log(embeds);
        return message.channel.send({ embeds });
      } else {
        return message.channel.send(`No rules found.`);
      }
    } else {
      return message.channel.send(
        "Please provide a query.\nAdd-> ['add','create'] \nRemove -> ['remove','delete'] \n Send -> ['send']"
      );
    }
  },
};
