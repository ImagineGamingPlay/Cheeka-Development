const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.youtube.com/c/ImagineGamingPlay/community", {
    waitUntil: "networkidle2",
    timeout: 0,
  });
  const a = await page.waitForSelector("#main");
  let values = await Promise.all(
    a.map((c) =>
      c.$("#content-text").then(async (textA) => {
        const text = await textA.evaluate((e) => e.textContent);
        let rawImg = await c.$("#img");
        const img = rawImg
          ? await rawImg.evaluate((el) => el.getAttribute("src"))
          : null;
        return {
          text,
          img,
        };
      })
    )
  );
  browser.close();
  console.log(values);
})();
