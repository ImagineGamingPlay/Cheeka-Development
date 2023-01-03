const {
  MessageEmbed,
  Invite,
  Client,
  Message,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
module.exports = {
  name: "invites",
  aliases: ["inv"],
  description: "Check invite of a user",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {string[]} args
   * @returns
   */
  async run({client, message, args}) {
    // const command = args.shift();
    // if (command === "lb") {
    //   const invites = Array.from((await message.guild.invites.fetch()).values())
    //     .splice(0, 10)
    //     .splice(0, 10);
    //   let alrAddedUsers = new Map();
    //   invites.forEach((invite) => {
    //     if (alrAddedUsers.has(invite.inviter.id)) {
    //       alrAddedUsers.get(invite.inviter.id)["invites"] =
    //         alrAddedUsers.get(invite.inviter.id)["invites"] + invite.uses;
    //     } else {
    //       alrAddedUsers.set(invite.inviter.id, {
    //         invites: invite.uses,
    //         id: invite.inviter.id,
    //       });
    //     }
    //   });
    //   let indexA = 0;
    //   const embed = new MessageEmbed()
    //     .setTitle("Invites")
    //     .setColor("#171515")
    //     .setDescription(
    //       Array.from(alrAddedUsers.values())
    //         .map(
    //           (user) => `**${++indexA}.** <@${user.id}> - \`${user.invites}\``
    //         )
    //         .join("\n")
    //     );

    //   message.channel.send({
    //     embeds: [embed],
    //   });
    //   return;
    // }

    // if (command === "reset") {
    //   // Check if a user is mentioned

    //   let user = message.mentions.members.first() || "all";
    //   let c = new MessageEmbed()
    //     .setTitle("Are you sure?")
    //     .setDescription(
    //       `**ARE YOU SURE** you want to reset the invites of **${user}** user? This process can't be reverted and will **RESET ALL** invites of the user.`
    //     )
    //     .setColor("#171515")
    //     .setFooter({
    //       text: "Press button with ✅ to confirm or ❌ to cancel.",
    //     });
    //   let msg = await message.reply({
    //     embeds: [c],
    //     components: [
    //       new MessageActionRow().addComponents(
    //         new MessageButton()
    //           .setEmoji("✅")
    //           .setLabel("Continue")
    //           .setStyle("PRIMARY")
    //           .setCustomId("deletion-confirm"),
    //         new MessageButton()
    //           .setEmoji("❌")
    //           .setLabel("Cancel")
    //           .setStyle("DANGER")
    //           .setCustomId("deletion-cancel")
    //       ),
    //     ],
    //   });

    //   try {
    //     const btn = await message.awaitMessageComponent({
    //       componentType: "BUTTON",
    //       time: 30 * 1000,
    //       filter: (a) =>
    //         a.user.id === message.author.id &&
    //         (a.customId === "deletion-confirm" ||
    //           a.customId === "deletion-cancel"),
    //     });
    //     if (btn.customId === "deletion-confirm") {
    //       msg.edit({
    //         embeds: [
    //           c
    //             .setFooter({
    //               text: "Process completed.",
    //             })
    //             .setColor("GREEN"),
    //         ],
    //         components: [
    //           msg.components.map((a) => {
    //             a.components = a.components.map((a) => {
    //               a.setDisabled(true);
    //             });
    //             return a;
    //           }),
    //         ],
    //       });
    //       return;
    //     }
    //     if (btn.customId === "deletion-cancel") {
    //       btn.deferUpdate();
    //       msg.edit({
    //         embeds: [
    //           c
    //             .setFooter({
    //               text: "Process cancelled.",
    //             })
    //             .setColor("RED"),
    //         ],
    //         components: [
    //           msg.components.map((a) => {
    //             a.components = a.components.map((a) => {
    //               a.setDisabled(true);
    //             });
    //             return a;
    //           }),
    //         ],
    //       });
    //       return;
    //     }
    //   } catch (e) {
    //     // Edit the message, set the embed color to RED, Disable all the buttons and change footer to "Confirmation timed out"
    //     msg.edit({
    //       embeds: [
    //         c
    //           .setFooter({
    //             text: "Confirmation timed out.",
    //           })
    //           .setColor("RED"),
    //       ],
    //       components: [
    //         msg.components.map((a) => {
    //           a.components = a.components.map((a) => {
    //             a.setDisabled(true);
    //           });
    //           return a;
    //         }),
    //       ],
    //     });
    //   }

    //   return;
    // }
    let user =
      message.mentions.members.first() || client.users.cache.get(args[0]) || message.member
    message.guild.invites.fetch().then((invites) => {
      // Filter the invites
      /**
       * @type {Invite[]}
       */
      let invitesFiltered = invites.filter(
        (invite) => invite.inviter.id === user.id
      );
      let totalUses = invitesFiltered.reduce((a, b) => a + b.uses, 0);
      let embed = new MessageEmbed()
        .setTitle("Invites")
        .setColor("#12c4ff")
        .setDescription(`${user.user.tag} has \`${totalUses}\` invites usage.`);
      message.channel.send({
        embeds: [embed],
      });
    });
  },
};
