const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

async function mdToPdf(mdPath, outPdf) {
  const md = fs.readFileSync(mdPath, 'utf8');
  const htmlBody = marked(md);
  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Project Summary</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; margin: 40px; color: #222; }
        pre { background: #f6f8fa; padding: 12px; overflow: auto; }
        code { background: #f6f8fa; padding: 2px 4px; }
        h1,h2,h3 { color: #111; }
        .executive { border-left: 4px solid #2b6cb0; padding-left: 12px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
    <div class="executive">
      <h2>Executive Summary</h2>
      <p>A practical summary of the my-dapp project (local Hardhat dev, deploy, scripts, and CRA frontend integration).</p>
    </div>
    ${htmlBody}
    </body>
  </html>`;

  const tmpHtml = path.join(__dirname, '..', 'project-summary-temp.html');
  fs.writeFileSync(tmpHtml, html, 'utf8');

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto('file://' + tmpHtml, { waitUntil: 'networkidle0' });
  await page.pdf({ path: outPdf, format: 'A4', printBackground: true });
  await browser.close();
  fs.unlinkSync(tmpHtml);
}

if (require.main === module) {
  const mdPath = path.join(__dirname, '..', 'project-summary.md');
  const outPdf = path.join(__dirname, '..', 'my-dapp-summary.pdf');
  mdToPdf(mdPath, outPdf)
    .then(() => console.log('PDF created at', outPdf))
    .catch(err => {
      console.error('Failed to create PDF', err);
      process.exit(1);
    });
}
