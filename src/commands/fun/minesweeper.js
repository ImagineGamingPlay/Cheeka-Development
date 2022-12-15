const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const Discord = require("discord.js");
const { disableButtons, emojiCharacters } = require("../../functions/util.js");

module.exports = {
  name: "minesweeper",
  description: "Play a game of minesweeper",
  run: async (client, interaction, args) => {
    var arr = [
      [0, 0, 0, "💣", 0],
      [0, 0, 0, "💣", 0],
      [0, 0, 0, 0, "💣"],
      [0, 0, 0, 0, "💣"],
      [0, 0, 0, "💣", "💣", "💣"],
    ];

    function placeBombs(array) {
      for (let row = 0; row < array.length; row++) {
        let currentIndex = array[row].length,
          randomIndex;
        while (currentIndex != 0) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;

          [array[row][currentIndex], array[row][randomIndex]] = [
            array[row][randomIndex],
            array[row][currentIndex],
          ];
        }
      }
      return array;
    }
    placeBombs(arr);

    var block = 0;

    function count(data, i, j) {
      let c = 0;

      const prevRow = data[i - 1];
      const currentRow = data[i];
      const nextRow = data[i + 1];

      [prevRow, currentRow, nextRow].forEach((row) => {
        if (row) {
          if (row[j - 1] == "💣") c++;
          if (row[j] == "💣") c++;
          if (row[j + 1] == "💣") c++;
        }
      });
      return c;
    }

    function update(data) {
      return data.map((a, i) => {
        return a.map((b, j) => {
          return b == "💣" ? b : count(data, i, j);
        });
      });
    }

    const result = update(arr);
    arr = result;
    let positions = [];

    for (let row = 0; row < arr.length; row++) {
      for (let col = 0; col < arr[row].length; col++) {
        if (arr[row][col] === "💣") {
          let obj = {
            r: {
              emoji: `💣`,
              style: "DANGER",
              custom_id: `bomb${row}${col}`,
              disabled: true,
              type: 2,
            },
            a: {
              label: `-`,
              style: "SECONDARY",
              custom_id: `neutralbomb${row}${col}`,
              type: 2,
            },
          };
          positions.push(obj);
        } else if (arr[row][col] === 0) {
          block += 1;
          let obj = {
            r: {
              emoji: emojiCharacters(arr[row][col]),
              style: "SUCCESS",
              custom_id: `${arr[row][col]}${row}${col}`,
              disabled: true,
              type: 2,
            },
            a: {
              emoji: emojiCharacters(arr[row][col]),
              style: "SUCCESS",
              custom_id: `neutral${arr[row][col]}${row}${col}`,
              disabled: true,
              type: 2,
            },
          };
          positions.push(obj);
        } else if (isNaN(arr[row][col]) === false && arr[row][col] !== 0) {
          let obj = {
            r: {
              emoji: emojiCharacters(arr[row][col]),
              style: "PRIMARY",
              custom_id: `${arr[row][col]}${row}${col}`,
              disabled: true,
              type: 2,
            },
            a: {
              label: `-`,
              style: "SECONDARY",
              custom_id: `neutral${arr[row][col]}${row}${col}`,
              type: 2,
            },
          };
          positions.push(obj);
        }
      }
    }

    let row1 = new MessageActionRow().addComponents(
      positions[0].a,
      positions[1].a,
      positions[2].a,
      positions[3].a,
      positions[4].a
    );
    let row2 = new MessageActionRow().addComponents(
      positions[5].a,
      positions[6].a,
      positions[7].a,
      positions[8].a,
      positions[9].a
    );
    let row3 = new MessageActionRow().addComponents(
      positions[10].a,
      positions[11].a,
      positions[12].a,
      positions[13].a,
      positions[14].a
    );
    let row4 = new MessageActionRow().addComponents(
      positions[15].a,
      positions[16].a,
      positions[17].a,
      positions[18].a,
      positions[19].a
    );
    let row5 = new MessageActionRow().addComponents(
      positions[20].a,
      positions[21].a,
      positions[22].a,
      positions[23].a,
      positions[24].a
    );

    let game = new MessageEmbed()
      .setDescription(
        `**<@${interaction.user.id}>'s Minesweeper Game**\nBlocks Found: ${block}`
      )
      .setColor("#6F8FAF");

    let opt = new MessageEmbed()
      .setTitle("Minesweeper")
      .setDescription(
        `**<@${interaction.user.id}>'s Minesweeper Game**\n***Choose your Option.***`
      )
      .setColor("#6F8FAF");

    let msg = await interaction
      .reply({
        embeds: [game],
        components: [row1, row2, row3, row4, row5],
        fetchReply: true,
      })
      .catch((e) => {});

    let collector = msg.createMessageComponentCollector({
      time: 120000,
    });
    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id)
        return i.reply({
          content: "This is not for you.",
          ephemeral: true,
        });
      if (!i.isButton()) return;

      let dig = new MessageButton()
        .setStyle("SUCCESS")
        .setEmoji(`1033788615555285004`)
        .setCustomId(`dig_${i.customId}`);

      let digd = new MessageButton()
        .setStyle("SUCCESS")
        .setEmoji(`1033788615555285004`)
        .setCustomId(`digDisabled`)
        .setDisabled(true);

      let flag = new MessageButton()
        .setStyle("DANGER")
        .setEmoji("🚩")
        .setCustomId(`flg_${i.customId}`);

      let rf = new MessageActionRow().addComponents([dig, flag]);
      let f = new MessageActionRow().addComponents([digd, flag]);

      let button = positions.find((x) => x.a.custom_id === i.customId);

      if (button.a.emoji === "🚩") {
        rf.components[0].setDisabled(true);
      } else if (button.a.emoji !== "🚩") {
        rf.components[0].setDisabled(false);
      }

      let msg2 = await i.reply({
        embeds: [opt],
        components: [rf],
        ephemeral: true,
        fetchReply: true,
      });

      async function edit(positions, i, interaction, block, game) {
        row1 = new MessageActionRow().addComponents(
          positions[0].a,
          positions[1].a,
          positions[2].a,
          positions[3].a,
          positions[4].a
        );
        row2 = new MessageActionRow().addComponents(
          positions[5].a,
          positions[6].a,
          positions[7].a,
          positions[8].a,
          positions[9].a
        );
        row3 = new MessageActionRow().addComponents(
          positions[10].a,
          positions[11].a,
          positions[12].a,
          positions[13].a,
          positions[14].a
        );
        row4 = new MessageActionRow().addComponents(
          positions[15].a,
          positions[16].a,
          positions[17].a,
          positions[18].a,
          positions[19].a
        );
        row5 = new MessageActionRow().addComponents(
          positions[20].a,
          positions[21].a,
          positions[22].a,
          positions[23].a,
          positions[24].a
        );

        await interaction.editReply({
          embeds: [
            game.setDescription(
              `**<@${interaction.user.id}>'s Minesweeper Game**\nBlocks Found: ${block}`
            ),
          ],
          components: [row1, row2, row3, row4, row5],
        });
      }

      let collector2 = msg2.createMessageComponentCollector({
        time: 120000,
      });

      collector2.on("collect", async (ii) => {
        if (ii.customId.slice(0, 4) === "dig_") {
          let findButtonId = ii.customId.slice(4);
          let findButton = positions.find(
            (x) => x.a.custom_id === findButtonId
          );
          i.editReply({
            embeds: [opt],
            components: disableButtons(msg2.components),
          });
          ii.deferUpdate();
          if (findButton.r.style === "DANGER") {
            findButton.r.emoji = "💥";
            findButton.a = findButton.r;
            edit(positions, msg2, interaction, block, game);
            collector.stop();
            collector2.stop();
          } else if (findButton.r.style === "PRIMARY") {
            block += 1;
            collector.resetTimer();
            findButton.a = findButton.r;
            edit(positions, msg2, interaction, block, game);
            if (block === 14) {
              collector.stop("won");
              collector2.stop();
            }
          }
        } else if (ii.customId.slice(0, 4) === "flg_") {
          let findButtonId = ii.customId.slice(4);
          let findButton = positions.find(
            (x) => x.a.custom_id === findButtonId
          );
          if (findButton.a.emoji !== "🚩") {
            i.editReply({
              embeds: [opt],
              components: [f],
            });
            ii.deferUpdate();
          } else {
            i.editReply({
              embeds: [opt],
              components: [rf],
            });
            ii.deferUpdate();
          }
          if (findButton.a.emoji !== "🚩") {
            findButton.a.emoji = "🚩";
            findButton.a.label = null;
            edit(positions, msg2, interaction, block, game);
          } else {
            findButton.a.emoji = null;
            findButton.a.label = "-";
            edit(positions, msg2, interaction, block, game);
          }
        }
      });
    });

    collector.on("end", async (i, reason) => {
      if (reason === "time") {
        interaction
          .editReply({
            embeds: [
              game.setDescription(
                `**<@${interaction.user.id}> took to long so I stoped the game.**`
              ),
            ],
            components: [],
          })
          .catch((e) => {});
      } else if (reason === "won") {
        positions.forEach((g) => {
          g.a = g.r;
          row1 = new MessageActionRow().addComponents(
            positions[0].a,
            positions[1].a,
            positions[2].a,
            positions[3].a,
            positions[4].a
          );
          row2 = new MessageActionRow().addComponents(
            positions[5].a,
            positions[6].a,
            positions[7].a,
            positions[8].a,
            positions[9].a
          );
          row3 = new MessageActionRow().addComponents(
            positions[10].a,
            positions[11].a,
            positions[12].a,
            positions[13].a,
            positions[14].a
          );
          row4 = new MessageActionRow().addComponents(
            positions[15].a,
            positions[16].a,
            positions[17].a,
            positions[18].a,
            positions[19].a
          );
          row5 = new MessageActionRow().addComponents(
            positions[20].a,
            positions[21].a,
            positions[22].a,
            positions[23].a,
            positions[24].a
          );
        });
        interaction
          .editReply({
            embeds: [
              game.setDescription(
                `**${interaction.user}'s Minesweeper Game**\nBlocks Found: ${block}`
              ),
            ],
            content: `🏆 YOU WON 🎉`,
            components: [row1, row2, row3, row4, row5],
          })
          .catch((e) => {});
      } else {
        positions.forEach((g) => {
          g.a = g.r;
          row1 = new MessageActionRow().addComponents(
            positions[0].a,
            positions[1].a,
            positions[2].a,
            positions[3].a,
            positions[4].a
          );
          row2 = new MessageActionRow().addComponents(
            positions[5].a,
            positions[6].a,
            positions[7].a,
            positions[8].a,
            positions[9].a
          );
          row3 = new MessageActionRow().addComponents(
            positions[10].a,
            positions[11].a,
            positions[12].a,
            positions[13].a,
            positions[14].a
          );
          row4 = new MessageActionRow().addComponents(
            positions[15].a,
            positions[16].a,
            positions[17].a,
            positions[18].a,
            positions[19].a
          );
          row5 = new MessageActionRow().addComponents(
            positions[20].a,
            positions[21].a,
            positions[22].a,
            positions[23].a,
            positions[24].a
          );
        });
        interaction
          .editReply({
            embeds: [
              game.setDescription(
                `**<@${interaction.user.id}>'s Minesweeper Game**\nBlocks Found: ${block}`
              ),
            ],
            content: `💥 *Explosion Sounds*`,
            components: [row1, row2, row3, row4, row5],
          })
          .catch((e) => {});
      }
    });
  },
};
