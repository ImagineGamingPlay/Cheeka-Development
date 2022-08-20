const {readdirSync} = require('fs');

const selectMenuFolders = readdirSync('./src/selectMenus').forEach(folder => {
  const selectMenus = readdirSync(`./src/selectMenus/${folder}`).filter(file =>
    file.endsWith('.js'),
  );

  selectMenus.forEach(f => {
    const selectMenu = require(`../selectMenus/${folder}/${f}`);
    client.selectMenus.set(selectMenu.id, selectMenu);
  });
});
