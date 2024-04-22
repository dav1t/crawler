const { JSDOM } = require("jsdom");

function normilizeURL(url) {
  const urlObj = new URL(url);
  const normilizedUrl = urlObj.hostname + urlObj.pathname;

  if (normilizedUrl[normilizedUrl.length - 1] === "/") {
    return normilizedUrl.slice(0, -1);
  }

  return normilizedUrl;
}

function getURLsFromHTML(html, baseURL) {
  const urls = [];
  const dom = new JSDOM(html);

  dom.window.document.querySelectorAll("a").forEach((a) => {
    try {
      new URL(a.href);
    } catch (e) {
      urls.push(new URL(a.href, baseURL).href);
      return;
    }

    urls.push(a.href);
  });
  return urls;
}

async function crawlPage(baseURL, currentUrl, pages) {
  console.log(`Crawling: ${currentUrl}`);
  const response = await fetch(currentUrl);

  if (response.status >= 400) {
    console.log(`Error: ${response.status} ${response.statusText}`);
    return;
  }

  if (!response.headers.get("content-type").includes("text/html")) {
    console.log("Error: Not an HTML page");
    return;
  }

  const html = await response.text();

  const urls = getURLsFromHTML(html, currentUrl);

  urls.map(normilizeURL).forEach((url) => {
    if (!pages[url]) {
      pages[url] = 0;
    }

    if (pages[url] === 0 && url.includes(baseURL)) {
      crawlPage(baseURL, url, pages);
    }

    pages[url]++;
  });

  return pages;
}

module.exports = { normilizeURL, getURLsFromHTML, crawlPage };
