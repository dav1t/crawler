const { argv, exit } = require("node:process");

const { crawlPage } = require("./crawl");
const { printReport } = require("./report");

async function main() {
  if (argv.length < 3) {
    console.log("Usage: node main.js <baseUrl>");
    exit(1);
  } else if (argv.length > 3) {
    console.log("Too many arguments");
    exit(1);
  }

  const baseURL = argv[2];
  console.log("Base URL:", baseURL);

  const pages = await crawlPage(baseURL, baseURL, {
    internals: {},
    externals: {},
    errors: {},
  });

  printReport(pages);
}

main();
