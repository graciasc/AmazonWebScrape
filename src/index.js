const express = require("express");
const app = express();
const port = 8000;

const url ="https://www.amazon.com/Best-Sellers-Electronics-Televisions/zgbs/electronics/172659";
const puppeteer = require("puppeteer");

app.get("/", async (req, res) => {
  const webScraper = (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    //wait until page is loaded
    await page.goto(url, { waitUntil: "networkidle2" });
    // wait for selector
    await page.waitForSelector(".zg-item-immersion");

    // access page DOM
    let data = await page.evaluate(() => {
      // create array from selector
      return Array.from(document.querySelectorAll("li.zg-item-immersion")).map(
        (dataAgg) => {

          let name = dataAgg.querySelector("div.p13n-sc-truncated");
          let price = dataAgg.querySelector("span.p13n-sc-price");

          //validation
          if (price) {
            price = price.innerHTML;
          }
          if (name) {
            name = name.innerHTML;
          }

          return {
            name,
            price,
          };
        }
      );
    });
// Save the screenshot in directory
    await page.screenshot({
      path: "./amazon-screenshot.png", 
      fullPage: true,
    });

    // close page
    await page.close();
    // close browser
    await browser.close();

    return data;
  })();
  // log data
  console.log(await webScraper);
  // return data as an endpoint
  res.json(await webScraper);
});
app.listen(port, () => {
  console.log("Successful", port);
});
