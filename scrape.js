const puppeteer = require('puppeteer');
const {parentPort} = require('worker_threads');
const {createHash} = require('crypto');

(async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/c/ImagineGamingPlay/community', {
    waitUntil: 'networkidle2',
    timeout: 0,
  });
  await page.waitForSelector('#main');
  const a = await page.$$('#main');
  let values = await Promise.all(
    a.map(c =>
      c.$('#content-text').then(async textA => {
        const text = await textA.evaluate(e => e.textContent);
        let rawImg = await c.$('#img');
        const img = rawImg
          ? await rawImg.evaluate(el => el.getAttribute('src'))
          : null;
        return {
          text,
          img,
          hash: createHash('md5')
            .update(text + img)
            .digest('hex'),
        };
      }),
    ),
  );
  browser.close();
  parentPort.postMessage(values);
})();
