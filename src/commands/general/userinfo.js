const { MessageEmbed, Permissions } = require("discord.js");
const { userCache } = require("../../utils/Cache");
const moment = require("moment");
const CommandStructure =
  require("../../structure/CommandStructure").CommandStructure;

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
   *
   * @param {CommandStructure}
   * @returns {Promise<*>}
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

    if (member.permissions.has("KICK_MEMBERS")) {
      permissions.push("Kick Members");
    }

    if (member.permissions.has("BAN_MEMBERS")) {
      permissions.push("Ban Members");
    }

    if (member.permissions.has("ADMINISTRATOR")) {
      permissions.push("Administrator");
    }

    if (member.permissions.has("MANAGE_MESSAGES")) {
      permissions.push("Manage Messages");
    }

    if (member.permissions.has("MANAGE_CHANNELS")) {
      permissions.push("Manage Channels");
    }

    if (member.permissions.has("MENTION_EVERYONE")) {
      permissions.push("Mention Everyone");
    }

    if (member.permissions.has("MANAGE_NICKNAMES")) {
      permissions.push("Manage Nicknames");
    }

    if (member.permissions.has("MANAGE_ROLES")) {
      permissions.push("Manage Roles");
    }

    if (member.permissions.has("MANAGE_WEBHOOKS")) {
      permissions.push("Manage Webhooks");
    }

    if (member.permissions.has("MANAGE_EMOJIS_AND_STICKERS")) {
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
