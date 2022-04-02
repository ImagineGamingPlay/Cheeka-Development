const { prefix, devs } = require("../../config.json");
//Create cooldowns map
const cooldowns = new Map();
const { Collection, MessageEmbed } = require("discord.js");
//Blacklist system
const {
  blackListCache,
  cBlackListCache,
  afkUsers,
  tagsCache,
} = require("../utils/Cache");
module.exports = {
  name: "messageCreate",
  /**
   * @param message {Message}
   * @param client {Client}
   * @returns {Promise<*>}
   */
  async execute(message, client) {
    if (
      message.channel.id === "745283907670245406" ||
      message.channel.id === "802783156281016340"
    ) {
      const EMOJIREGEX =
        /((?<!\\)<:[^:]+:(\d+)>)|\p{Emoji_Presentation}|\p{Extended_Pictographic}/gmu;
      let emojies = message.content.match(EMOJIREGEX);
      if (emojies) {
        emojies.forEach((a) => {
          if (a.startsWith("<")) {
            message.react(a.slice(2, -1));
          } else {
            message.react(a);
          }
        });
      }
    }
    if (afkUsers.has(message.author.id)) {
      // Get the user's previous username
      let user = afkUsers.get(message.author.id);
      // Set the user's username back to their previous username
      try {
        await message.member.setNickname(user.username);
      } catch (ignored) {}
      // Remove the user from the afkUsers map
      afkUsers.delete(message.author.id);
      // Reply to the user that they are no longer afk
      message.reply({
        embeds: [new MessageEmbed().setColor("GREEN").setTitle("AFK Removed!")],
      });
    }
    if (!message.author?.bot) {
      message.mentions.members.forEach((user) => {
        if (afkUsers.has(user.id)) {
          let userA = afkUsers.get(user.id);
          message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`User AFK`)
                .addField("User", user.user.tag, false)
                .addField("Reason", userA.reason, false),
            ],
          });
        }
      });
    }
    // Prefix is a list of prefixes as a array. Check if the message starts with any of the prefixes
    let rPrefix = prefix.reduce((acc, cur) => {
      if (message.content.startsWith(cur)) acc.push(cur);
      return acc;
    }, [])[0];
    if (
      message.author?.bot ||
      !message.guild ||
      !message.content.startsWith(rPrefix)
    )
      return;

    const args = message.content.slice(rPrefix.length).trim().split(" ");
    const cmd = args.shift().toLowerCase();
    const command =
      client.commands.get(cmd) ||
      client.commands.find((a) => a.aliases && a.aliases.includes(cmd));

    if (!command) {
      // Check if a tag exists for the similar
      let a = tagsCache.get(
        message.content.slice(rPrefix.length).split(" ")[0]
      );
      if (a && a.enabled) {
        // Reply with the content
        await message.reply({
          content: a.content,
          allowedMentions: [{ repliedUser: false, everyone: false }],
        });
      }
      return;
    }
    //Blacklist here
    const data = blackListCache.get(message.author?.id);
    const blacklistedChannel = cBlackListCache.get(message.channel.id);
    if (blacklistedChannel) {
      let a = await message.reply(
        "You are not allowed to use commands in this channel!"
      );
      setTimeout(() => {
        a.delete();
        message.delete().catch(() => {});
      }, 5000);
      return;
    }
    if (!data) {
      //Normal code but placed in the  block
      //Cooldown system
      /**
       * @type string[]
       */
      if (command.disabledChannel) {
        // Make sure that the command is not disabled in the channel
        if (command.disabledChannel.includes(message.channel.id)) {
          let a = await message.reply(
            "This command is disabled in this channel!"
          );
          setTimeout(() => {
            a.delete();
            message.delete().catch(() => {});
          }, 5000);
          return;
        }
      }
      if (command.cooldown) {
        //If cooldowns map doesn't have a command.name key then create one.
        if (!cooldowns.has(command.name)) {
          cooldowns.set(command.name, new Collection());
        }

        const current_time = Date.now();
        const time_stamps = cooldowns.get(command.name);
        const cooldown_amount = command.cooldown * 1000;

        //If time_stamps has a key with the author's id then check the expiration time to send a message to a user.
        if (time_stamps.has(message.author.id)) {
          const expiration_time =
            time_stamps.get(message.author.id) + cooldown_amount;

          if (current_time < expiration_time) {
            const time_left = (expiration_time - current_time) / 1000;

            return message.reply(
              `Please wait ${time_left.toFixed(1)} more seconds before using ${
                command.name
              }`
            );
          }
        }

        //If the author's id is not in time_stamps then add them with the current time.
        time_stamps.set(message.author.id, current_time);
        //Delete the user's id once the cooldown is over.
        setTimeout(
          () => time_stamps.delete(message.author.id),
          cooldown_amount
        );
      }
      //Ends of cooldown system
      const member = message.member;

      if (command.devCmd && !devs.includes(member.id)) {
        return message.reply("This command can only be used by developers!");
      }

      if (command.permissions && command.permissions.length > 0) {
        if (!member.permissions.has(command.permissions))
          if (!devs.includes(member.id))
            return message.reply(
              "You don't have the required permissions to use this command!"
            );
      }
      if (command.guildOnly && !message.guild)
        return message.reply("This command can only be used in a guild!");

      try {
        await command.run({ client, message, args });
      } catch (err) {
        console.log(err);
      }
    } else {
      return message.reply(
        "Sorry you are blacklisted form running the commands."
      );
    }
  },
};
