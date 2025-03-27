import * as cheerio from "cheerio";
import url from "node:url";

// Scrape for website metadata
export async function getMetadata(website_url: string) {
  try {
    const $ = await cheerio.fromURL(website_url);

    // Extract logo (Assuming logo image has a class="logo")
    const logo_url = $("img.logo").attr("src");

    // Extract favicon (Link tag)
    const faviconArr: string[] = [];
    $('link[rel="icon"]').each((i, el) => {
      let favicon = $(el).attr("href");
      if (favicon) {
        if (!favicon?.startsWith("https")) {
          favicon = url.resolve(website_url, String(favicon));
        }

        faviconArr.push(favicon);
      }
    });

    // Extract the title
    const title = $("title").text();

    // Extract subtitle (Assuming subtitle is in <h1>, <h2>, etc.)
    const subtitle = $("h1").text() || $("h2").text() || $("h3").text(); // Can be expanded for other headings

    // Extract description (Meta tag)
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[name="og:description"]').attr("content"); // Fallback to Open Graph

    // Extract keywords (Meta tag)
    const keywords =
      $('meta[name="keywords"]').attr("content") ||
      $('meta[name="og:keywords"]').attr("content"); // Fallback to Open Graph

    const data = {
      logo_url,
      favicons: faviconArr,
      title,
      subtitle,
      description,
      keywords: keywords ? keywords.split(",") : [],
    };

    return data;
  } catch (err) {
    console.log("Erro scraping the  page: ", err);
    throw err;
  }
}
