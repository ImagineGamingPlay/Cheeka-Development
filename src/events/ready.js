const {
  blackListCache,
  cBlackListCache,
  rulesCache,
  tagsCache,
  guildCache,
} = require("../utils/Cache");
const { Constants } = require("discord.js");
const Blacklist = require("../schema/blacklist");
const { BlacklistChannel } = require("../schema/blacklist");
const { RulesChannel } = require("../schema/rules");
const tags = require("../schema/tags");
const user = require("../schema/user");
const { userCache } = require("../utils/Cache");
const { GuildData } = require("../schema/guild");
const fs = require("fs");
const { MessageEmbed } = require("discord.js");
const path = require("path");
module.exports = {
  name: "ready",
  // once: true,
  async execute(client) {
    // <------------- SLASH COMMAND HANDLING START------------->
    const functionList = [{ name: "role selector", value: "role-selector" }];
    const guildId = config.mainGuildID;
    const guild = client.guilds.cache.get(guildId);
    let commands;

    if (guild) {
      commands = guild.commands;
    } else {
      commands = client.appication.commands;
    }

    commands.create({
      name: "function",
      description: "run a admin only function",
      options: [
        {
          name: "name",
          description: "name of the function",
          type: Constants.ApplicationCommandOptionTypes.STRING,
          choices: functionList,
          required: true,
        },
      ],
    });
    // <------------- SLASH COMMAND HANDLING END------------->
    console.log(`Logged in as ${client.user.tag}`);
    // From the temporary file stored as 'restart.txt' in the main project directory, read the content of it express it in terms of ${message.id} ${message.channel.id} ${message.guild.id}
    fs.readFile(path.join(__dirname, "../../restart.txt"), (err, data) => {
      if (err) {
        return;
      }
      // If the content of the file is not empty, then...
      if (data) {
        // data is a buffer, so we need to convert it to a string
        const restart = data.toString();
        // Split the content of the file into an array
        const [messageId, channelId, guildId, time] = restart.split(",");
        client.channels.fetch(channelId).then((channel) => {
          channel.messages.fetch(messageId).then((message) => {
            // subtract the time from the current time, time is in milliseconds
            const timeLeft = Date.now() - parseInt(time);
            message.edit({
              embeds: [
                new MessageEmbed()
                  .setTitle("Started!")
                  .setDescription("The bot has started up!")
                  .setColor("GREEN")
                  .addField("Time taken", `${timeLeft / 1000}s`),
              ],
            });
          });
        });
        // Delete the temporary file
        fs.unlink(path.join(__dirname, "../../restart.txt"), (err) => {
          if (err) {
            return;
          }
        });
      }
    });
    //<------- AUTO CHANGING STATUS START ------->
    let today = new Date();
let christmasYear = today.getFullYear();

if (today.getMonth() == 11 && today.getDate() > 25) {
  christmasYear = christmasYear + 1;
}

let christmasDate = new Date(christmasYear, 11, 25);
let dayMilliseconds = 1000 * 60 * 60 * 24;

let remainingDays = Math.ceil(
  (christmasDate.getTime() - today.getTime()) /
   (dayMilliseconds)
);
    const statusData = [
      {
      //   name: "Imagine Gaming Play",
      //   type: "WATCHING",
      //   status: "ONLINE",
      // },
      // {
      //   name: "IGP in a nutshell",
      //   type: "WATCHING",
      //   status: "ONLINE",
      // },
      // {
      //   name: "Halloween",
      //   type: "WATCHING",
      //   status: "ONLINE",
      // },
        name: remainingDays + " days until Christmas 🎄",
        type: "WATCHING",
        status: "dnd",
      }
    ];
    function pickStatus() {
      const random = Math.floor(Math.random() * statusData.length);

      try {
        client.user.setPresence({
          activities: [
            {
              name: statusData[random].name,
              type: statusData[random].type,
            },
          ],
          // status: statusData[random].status,
        });
      } catch (err) {
        console.error(err);
      }
    }

    setInterval(pickStatus, 10 * 1000);
    console.log(client.user.setStatus("dnd"))
    //<------- AUTO CHANGING STATUS END ------->
    Blacklist.find({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        /**
         * @param blacklist {Blacklist[]}
         */
        data.forEach((blacklist) => {
          blackListCache.set(blacklist.UserId, true);
        });
      }
    });
    BlacklistChannel.find({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        /**
         * @param blacklist {BlacklistChannel[]}
         */
        data.forEach((blacklist) => {
          cBlackListCache.set(blacklist.channelId, true);
        });
      }
    });

    tags.find({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        /**
         * @param tag {TagSchema}
         */
        data.forEach((tag) => {
          tagsCache.set(tag.name, tag);
        });
      }
    });

    RulesChannel.find({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        /**
         * @param de {RulesChannel[]}
         */
        data.forEach((de) => {
          rulesCache.set(de.guildId, de.rules);
        });
      }
    });
    user.find({}, (err, data) => {
      if (err) {
        console.error(err);
      }
      data.forEach((de) => {
        userCache.set(de.id, de);
      });
    });

    GuildData.find({}, (err, data) => {
      if (err) {
        console.error(err);
      }
      data.forEach((de) => {
        guildCache.set(de.id, de);
      });
    });
  },
};
