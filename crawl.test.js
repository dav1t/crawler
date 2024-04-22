const { test, expect, describe } = require("@jest/globals");

const { normilizeURL, getURLsFromHTML } = require("./crawl");

describe("normilizeURL", () => {
  test("it should return hostname only", async () => {
    expect(normilizeURL("http://example.com")).toBe("example.com");
  });

  test("it should remove slash", async () => {
    expect(normilizeURL("http://example.com/")).toBe("example.com");
  });

  test("it should return hostname and path", async () => {
    expect(normilizeURL("http://example.com/path")).toBe("example.com/path");
  });

  test("it should remove slash from path", async () => {
    expect(normilizeURL("http://example.com/path/")).toBe("example.com/path");
  });

  test("it should return hostname and path", async () => {
    expect(normilizeURL("http://example.com/path/")).toBe("example.com/path");
  });

  test("it should return hostname and path", async () => {
    expect(normilizeURL("https://example.com/path")).toBe("example.com/path");
  });

  test("it should return hostname and path", async () => {
    expect(normilizeURL("https://example.com:8080/path")).toBe(
      "example.com/path"
    );
  });
});

describe("getURLsFromHTML", () => {
  test("it should return empty array", async () => {
    expect(getURLsFromHTML("", "http://example.com")).toEqual([]);
  });

  test("it should return empty array", async () => {
    expect(getURLsFromHTML("<html></html>", "http://example.com")).toEqual([]);
  });

  test("it should return correct url array", async () => {
    expect(
      getURLsFromHTML(
        `<html>
        <body>
            <a href="hello"><span>Go to Boot.dev</span></a>
        </body>
        </html>`,
        "http://example.com"
      )
    ).toEqual(["http://example.com/hello"]);
  });

  test("it should return correct url array", async () => {
    expect(
      getURLsFromHTML(
        `<html>
        <body>
            <a href="/hello"><span>Go to Boot.dev</span></a>
        </body>
        </html>`,
        "http://example.com"
      )
    ).toEqual(["http://example.com/hello"]);
  });

  test("it should return correct url array", async () => {
    expect(
      getURLsFromHTML(
        `<html>
        <body>
            <a href="http://example.com/hello"><span>Go to Boot.dev</span></a>
        </body>
        </html>`,
        "http://example.com"
      )
    ).toEqual(["http://example.com/hello"]);
  });

  test("it should return array which contains two urls", async () => {
    expect(
      getURLsFromHTML(
        `<html>
        <body>
        <a href="/hello"><span>Go to Boot.dev</span></a>
        <a href="/world"><span>Go to Boot.dev</span></a>
        </body>
        </html>`,
        "http://example.com"
      )
    ).toEqual(["http://example.com/hello", "http://example.com/world"]);
  });
});
