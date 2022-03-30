const { MessageEmbed} = require("discord.js");

module.exports = {
  name: "role",
  description: "manage roles for a user",
  aliases: ["roles"],
  category: "Moderation",
  permissions: ["MANAGE_ROLES"],
  run: async ({ client, message, args }) => {
    const query = args[0];
    const role =
      message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
    const target =
      message.mentions.members.first() ||
      message.guild.members.cache.get(args[2]);
    const reason = args.slice(2).join(" ") || "No reason provided";
    const choices = ["add", "remove", "check"];
    
    if (!choices.includes(query))
      return message.reply(
        "Action invalid. The available actions are: add, remove, check"
      );
    if (!query) return message.reply("you need to specify an action!");
    if (!role) return message.reply("you need to specify a role!");
    if (!target)
      return message.reply("Please provide a user to perform this action on!");

    if (query === "add") {
      if (target.roles.cache.has(role.id)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`**${target} already has ${role} role!**`),
          ],
        });
      } else {
        target.roles.add(role.id, reason);
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`**${target} has been given ${role} role!**`),
          ],
        });
      }
    } else if (query === "remove") {
      if (!target.roles.cache.has(role.id)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`**${target} does not have ${role} role!**`),
          ],
        });
      } else {
        target.roles.remove(role.id, reason);
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`**${role} has been removed from ${target}!**`),
          ],
        });
      }
    } else if (query === "check") {
      if (target.roles.cache.has(role.id)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("GREEN")
              .setDescription(`**${target} has ${role} role!**`),
          ],
        });
      } else {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("RED")
              .setDescription(`**${target} does not have ${role} role!**`),
          ],
        });
      }
    }
  },
};
