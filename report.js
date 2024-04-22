const Table = require("cli-table");

function printReport(pages) {
  const table = new Table({
    head: ["URL", "Count"],
  });

  Object.entries(pages)
    .sort((a, b) => b[1] - a[1])
    .forEach(([url, count]) => {
      table.push([url, count]);
    });

  console.log(table.toString());
}

module.exports = { printReport };
