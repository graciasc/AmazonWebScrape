const express = require("express");
const app = express();
const port = 8000;

const url =
  "https://www.amazon.com/Best-Sellers-Electronics-Televisions/zgbs/electronics/172659";
const puppeteer = require("puppeteer");


app.get("/", async (req, res) => {
  const webScraper = (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    //wait until page is loaded
    await page.goto(url, { waitUntil: "networkidle2" });
    //   await page.screenshot({ path: 'amazon.png' });
  
    let data = await page.evaluate(() => {
      return Array.from(
        document.querySelectorAll('li[class="zg-item-immersion"]')
      ).map((d) => {
        let name = d.querySelector('div[class="p13n-sc-truncated"]');
        let price = d.querySelector('span[class="p13n-sc-price"]');
        if (price) {
          price = d.querySelector('span[class="p13n-sc-price"]').innerHTML;
        }
        if (name) {
          name = d.querySelector('div[class="p13n-sc-truncated"]').innerHTML;
        }
  
        return {
          name,
          price,
        };
      });
    });
  
    await browser.close();
    return data  


  })();
 console.log(await webScraper)
  res.json(await webScraper)
});
app.listen(port, () => {
  console.log("made it", port);
});
