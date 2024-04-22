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
  const { internals, externals, errors } = pages;

  if (!internals[currentUrl]) {
    internals[currentUrl] = 0;
  }

  internals[currentUrl]++;

  console.log(`Crawling: ${currentUrl}`);
  const response = await fetch(currentUrl);

  if (response.status >= 400) {
    console.log(`Error: ${response.status} ${response.statusText}`);
    return;
  }

  if (!response.headers.get("content-type").includes("text/html")) {
    console.log(`Error: ${currentUrl} Not an HTML page`);

    if (!errors[currentUrl]) {
      errors[currentUrl] = 0;
    }

    errors[currentUrl]++;

    return;
  }

  const html = await response.text();

  const urls = getURLsFromHTML(html, baseURL);

  for (const url of urls) {
    if (!url.startsWith(baseURL)) {
      if (!externals[url]) {
        externals[url] = 0;
      }
      externals[url]++;
      continue;
    }

    if (!internals[url]) {
      await crawlPage(baseURL, url, pages);
    } else {
      internals[url]++;
    }
  }

  return pages;
}

module.exports = { normilizeURL, getURLsFromHTML, crawlPage };
