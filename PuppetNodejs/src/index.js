const express = require('express')
const app = express();
const port = 8000


const url = 'https://www.amazon.com/Best-Sellers-Electronics-Televisions/zgbs/electronics/172659'
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //wait until page is loaded
  await page.goto(url, {waitUntil: 'networkidle0',});
//   await page.screenshot({ path: 'amazon.png' });

let data = await page.evaluate(() => {

    let name = document.querySelector('li[class="zg-item-immersion"]').innerHTML
    
    return name
    
    })
    console.log(data)



    await browser.close();

})();


app.get('/', (req, res) => {
res.send('Made it')
})


app.listen(port, () => {
console.log('RUNNING PORT', port)
})