const { MessageEmbed, Permissions } = require("discord.js");
const { userCache } = require("../../utils/Cache");
const moment = require("moment");

const status = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline/Invisible",
};

module.exports = {
  name: "userinfo",
  description: "Get's info of a user.",
  aliases: ["info", "whois"],
  permissions: [],
  category: "General",
  disabledChannel: [],
  cooldown: 10,
  /**
   * @param client {Client} A discord.js client
   * @param message {Message} A discord.js message
   * @param args {Array} A array of the arguments passed to the command
   * @returns {Promise<*>} Returns a promise that might return anything
   */
  run: async ({ client, message, args }) => {
    // Check if the user has mentioned anyone
    var permissions = [];
    var acknowledgements = "";

    const member =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    const randomColor = "#000000".replace(/0/g, function () {
      return (~~(Math.random() * 16)).toString(16);
    });

    if (message.member.permissions.has("KICK_MEMBERS")) {
      permissions.push("Kick Members");
    }

    if (message.member.permissions.has("BAN_MEMBERS")) {
      permissions.push("Ban Members");
    }

    if (message.member.permissions.has("ADMINISTRATOR")) {
      permissions.push("Administrator");
    }

    if (message.member.permissions.has("MANAGE_MESSAGES")) {
      permissions.push("Manage Messages");
    }

    if (message.member.permissions.has("MANAGE_CHANNELS")) {
      permissions.push("Manage Channels");
    }

    if (message.member.permissions.has("MENTION_EVERYONE")) {
      permissions.push("Mention Everyone");
    }

    if (message.member.permissions.has("MANAGE_NICKNAMES")) {
      permissions.push("Manage Nicknames");
    }

    if (message.member.permissions.has("MANAGE_ROLES")) {
      permissions.push("Manage Roles");
    }

    if (message.member.permissions.has("MANAGE_WEBHOOKS")) {
      permissions.push("Manage Webhooks");
    }

    if (message.member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
      permissions.push("Manage Emojis");
    }

    if (permissions.length == 0) {
      permissions.push("No Key Permissions Found");
    }

    if (member.id == message.guild.ownerId) {
      acknowledgements = "Server Owner";
    }
    if (member.premiumSince) {
      // If there was an acknowledgement, add a comma
      if (acknowledgements.length > 0) {
        acknowledgements += ", Server Booster";
      } else {
        acknowledgements = "Server Booster";
      }
    }
    // If no acknowledgement, set it to None
    if (!acknowledgements) {
      acknowledgements = "None";
    }
    const embed = new MessageEmbed()
      .setDescription(`<@${member.user.id}>`)
      .setAuthor({
        name: member.user.tag,
        iconURL: member.displayAvatarURL(),
      })
      .setColor(randomColor)
      .setFooter({
        text: `ID: ${message.author.id}`,
      })
      .setThumbnail(member.displayAvatarURL())
      .setTimestamp()
      .addField("Status", `${status[member.presence?.status]}`, true)
      .addField(
        "Joined at: ",
        `${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`,
        true
      )
      .addField(
        "Created at: ",
        `${moment(message.author.createdAt).format(
          "dddd, MMMM Do YYYY, HH:mm:ss"
        )}`,
        true
      )
      .addField("Permissions: ", `${permissions.join(", ")}`, true)
      .addField(
        `Roles [${
          member.roles.cache
            .filter((r) => r.id !== message.guild.id)
            .map((roles) => `\`${roles.name}\``).length
        }]`,
        `${
          member.roles.cache
            .filter((r) => r.id !== message.guild.id)
            .map((roles) => `<@&${roles.id}>`)
            .join(" **|** ") || "No Roles"
        }`,
        true
      )
      .addField("Acknowledgements", `${acknowledgements}`, true)
      .addField(
        "Thanks",
        userCache.has(member.id)
          ? userCache.get(member.id).thanks
            ? `${userCache.get(member.id).thanks}`
            : "0"
          : "0",
        true
      )
      .setThumbnail(member.displayAvatarURL());

    message.channel.send({ embeds: [embed] });
  },
};
