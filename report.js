const Table = require("cli-table");

function printReport(pages) {
  const { internals, externals } = pages;

  const externalLinksTable = generateTable(externals);
  const internalLinksTable = generateTable(internals);

  console.log("*".repeat(50));
  console.log("External Pages");
  console.log(externalLinksTable.toString());

  console.log("*".repeat(50));
  console.log("Internal Pages");
  console.log(internalLinksTable.toString());
}

function sortByCount(pages) {
  return Object.entries(pages).sort((a, b) => b[1] - a[1]);
}

function generateTable(pages) {
  const table = new Table({
    head: ["URL", "Count"],
  });

  sortByCount(pages).forEach(([url, count]) => {
    table.push([url, count]);
  });

  return table;
}

module.exports = { printReport };
