const fs = require("fs");
const path = require("path");
const puppeteer = require('puppeteer');
// const express = require('express');
const handlebars = require("handlebars");
// const app = express();
// const PORT = 8087;
// app.listen(PORT);



fs.readFile("./data.json", "utf8", (err, jsonString) => {
	if (err) {
	  console.log("Error reading file from disk:", err);
	  return;
	}
	try {
	  const data = JSON.parse(jsonString);
	  createPDF(data);
	} catch (err) {
	  console.log("Error parsing JSON string:", err);
	}
  });

async function createPDF(data){

	var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
	var template = handlebars.compile(templateHtml);
	var html = template(data);

	var milis = new Date();
	milis = milis.getTime();

	var pdfPath = path.join('pdf', `${data.docname}-${milis}.pdf`);

	var options = {
		width: '1230px',
		height: '1600px',
		headerTemplate: "<p></p>",
		footerTemplate: "<p></p>",
		displayHeaderFooter: false,
		margin: {
			top: "10px",
			bottom: "30px"
		},
		printBackground: true,
		path: pdfPath
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox'],
		headless: true
	});

	var page = await browser.newPage();
	
	await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});

	await page.pdf(options);
	await browser.close();
}

