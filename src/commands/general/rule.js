const { MessageEmbed, GuildTextBasedChannel } = require("discord.js");
const { RulesChannel } = require("../../schema/rules");
const { GuildData } = require("../../schema/guild");
const { rulesCache, guildCache } = require("../../utils/Cache");
const { prefix, devs } = require("../../../config.json");

module.exports = {
  name: "rule",
  description: "Check a rules of the server.",
  aliases: ["rules"],
  disabledChannel: [],
  category: "General",
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
            rulesCache.get(message.guild.id).length
        );
      const ruleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .addField(rule.title, rule.description, false);
      return await message.channel.send({
        embeds: [ruleEmbed],
      });
    }
    if (
      !devs.includes(message.member.id) &&
      message.member.permissions.missing(["ADMINISTRATOR"]).length > 0
    ) {
      return message.channel.send(
        "Please provide a rule number like `-rules 1`."
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
          this.update(message);
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
          this.update(message);
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
          this.update(message);
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
      // Get the channel to send the rules
      const channel = message.mentions.channels.first();
      if (!channel) return message.channel.send("Please mention a channel.");
      // Get the rules
      const rules = rulesCache.get(message.guildId);
      if (!rules) return message.channel.send("There are no rules.");
      // Rules can be more than 25, seprate them to multiple embeds.
      let currentEmbed = new MessageEmbed()
        .setAuthor({
          name: "IGP Community Guidelines",
          icon_url: message.guild.iconURL(),
        })
        .setColor("ORANGE");
      // Send the embeds
      let msg = await channel.send({
        embeds: [currentEmbed],
      });
      // Set the rules channel and message
      let guildS = guildCache.get(message.guildId) || { id: message.guildId };
      guildS.ruleChannel = channel.id;
      guildS.ruleMessage = msg.id;
      guildCache.set(message.guildId, guildS);
      // Upsert the guild
      await GuildData.updateOne(
        {
          id: message.guildId,
        },
        {
          ruleChannel: channel.id,
          ruleMessage: msg.id,
        },
        {
          upsert: true,
        }
      );
      this.update(message);
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
          .setTitle("__Rules__")
          .setDescription(
            "All the rules that must be followed are listed here!"
          )
          .setColor("#0099ff");
        let iPointer = 1;
        for (let i = 0; i < fields.length; i++) {
          if (pointerEmbed.fields.length >= 25) {
            embeds.push(pointerEmbed);
            pointerEmbed = new MessageEmbed().setColor("#0099ff");
          }
          pointerEmbed.addField(
            `${iPointer}) ${fields[i].name}`,
            fields[i].value,
            false
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
  update: async (message) => {
    // Get the rules channel
    const guildInfo = guildCache.get(message.guildId);
    // Check if the rules channel is set
    if (!guildInfo || !guildInfo.ruleChannel) return;
    // Fetch the channel and message
    const channel = await message.guild.channels.fetch(guildInfo.ruleChannel);
    const msg = await channel.messages.fetch(guildInfo.ruleMessage);

    // Get the rules
    const rules = rulesCache.get(message.guildId);
    const fields = rules.map((rule) => {
      return {
        name: rule.title,
        value: rule.description,
        inline: false,
      };
    });
    if (!rules) return;
    let iPointer = 1;
    // Rules can be more than 25, seprate them to multiple embeds.
    let embeds = [];
    let pointerEmbed = new MessageEmbed()
      .setAuthor({
        name: "IGP Community Guidelines",
        iconURL:
          "https://images-ext-2.discordapp.net/external/s_3olUDuxLwE1zKZEKnmxQsp3udo06B2w_nPqMa5GjA/https/cdn.discordapp.com/icons/697495719816462436/a_6db19f30e288a192f61d1c4975710585.gif",
      })
      .setTitle("__Rules__")
      .setDescription(
        `Hello everyone, welcome to the Imagine Gaming Play's Discord Server!
A newbie hole for new aspiring coders.\nMake friends, find people to collaborate with or help some people with their Discord Bot and earn a few scores. (Scores later can be used to unlock exciting rewards!)

    ↳ Social Links ↰
➔ Channel: https://youtube.com/ImagineGamingPlay
➔ Instagram: https://www.instagram.com/imaginegamingplayofficial/
➔ Twitter: https://twitter.com/yourman_igp
➔ Github: https://github.com/ImagineGamingPlay
➔ Website: https://imagine.cf/

We hope you have a good time here!
Below are some rules, please read all of them to get started. <:tctThinkDerp:878865297312981042>

`
      )
      .setColor("ORANGE")
      .setFooter({
        text: `Page | ${iPointer}/${Math.ceil(rules.length / 25)}`,
      });

    for (let i = 0; i < fields.length; i++) {
      if (pointerEmbed.fields.length >= 25) {
        embeds.push(pointerEmbed);
        pointerEmbed = new MessageEmbed().setColor("ORANGE").setFooter({
          text: `Page | ${iPointer}/${Math.ceil(rules.length / 25)}`,
        });
      }
      pointerEmbed.addField(`${fields[i].name}`, fields[i].value, false);
      iPointer += 1;
    }
    embeds.push(pointerEmbed);
    await msg.edit({
      embeds,
    });
  },
};
