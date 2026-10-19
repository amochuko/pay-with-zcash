import * as cheerio from "cheerio";

type WebsiteMetadata = {
  logo_url: string | undefined;
  favicons: string[];
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
};

type JsonRecord = Record<string, unknown>;

function normalizeText(value: string | undefined): string {
  return value?.replace(/\s+/g, " ").trim() ?? "";
}

function resolveUrl(
  value: string | undefined,
  baseUrl: string,
): string | undefined {
  if (!value) return undefined;

  const candidate = value.trim();

  if (
    !candidate ||
    candidate.startsWith("#") ||
    /^(data|blob|javascript):/i.test(candidate)
  ) {
    return undefined;
  }

  try {
    const resolved = new URL(candidate, baseUrl);

    if (!["http:", "https:"].includes(resolved.protocol)) {
      return undefined;
    }

    return resolved.href;
  } catch (error) {
    return undefined;
  }
}

function getMeta(
  $: cheerio.CheerioAPI,
  attribute: "name" | "property",
  key: string,
): string | undefined {
  const value = $(`meta[${attribute}]`)
    .filter((_, element) => {
      return $(element).attr(attribute)?.toLowerCase() === key.toLowerCase();
    })
    .first()
    .attr("content");

  return normalizeText(value) || undefined;
}

function getImageUrl(
  $: cheerio.CheerioAPI,
  element: any,
  baseUrl: string,
): string | undefined {
  const image = $(element);

  const candidates = [
    image.attr("src"),
    image.attr("data-src"),
    image.attr("data-lazy-src"),
    image.attr("data-original"),
    image.attr("srcset")?.split(",")[0]?.trim().split(/\s+/)[0],
  ];

  for (const candidate of candidates) {
    const resolved = resolveUrl(candidate, baseUrl);

    if (resolved) {
      return resolved;
    }

    return undefined;
  }
}

function getBackgroundImageUrl(
  style: string | undefined,
  baseUrl: string,
): string | undefined {
  const match = style?.match(
    /background(?:-image)?\s*:\s*url\(\s*(?:"([^"]+)"|'([^']+)'|([^)]*?))\s*\)/i,
  );

  const imageUrl = match?.[1] ?? match?.[2] ?? match?.[3];

  return resolveUrl(imageUrl?.trim(), baseUrl);
}

function getLogoFromDOM(
  $: cheerio.CheerioAPI,
  baseUrl: string,
): string | undefined {
  // 1. Prefer image elements explicitly identified as logos.
  const logoSelectors = [
    'img[class~="logo"]',
    'img[id="logo"]',
    'img[class*="logo"]',
    'img[id*="logo"]',
    'img[alt*="logo"]',
    'img[class*="brand"]',
    'img[id*="brand"]',
    "header img",
    '[role="banner"] img',
  ];

  for (const selector of logoSelectors) {
    let result: string | undefined;

    $(selector).each((_, elem) => {
      result ??= getImageUrl($, elem, baseUrl);
    });

    if (result) {
      return result;
    }
  }

  // 2. Find CSS background images on logo/brand containers
  let backgroundLogo: string | undefined;

  $("[style]").each((_, elem) => {
    if (backgroundLogo) return;

    const node = $(elem);
    const identity = [node.attr("class"), node.attr("id")]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!/(logo|brand)/i.test(identity)) return;

    backgroundLogo = getBackgroundImageUrl(node.attr("style"), baseUrl);
  });

  return backgroundLogo;
}

function getLogoFromJsonLD(
  $: cheerio.CheerioAPI,
  baseUrl: string,
): string | undefined {
  const records: JsonRecord[] = [];

  const collect = (value: unknown): void => {
    if (Array.isArray(value)) {
      value.forEach(collect);

      return;
    }

    if (!value || typeof value !== "object") return;

    const record = value as JsonRecord;
    records.push(record);

    if (record["@graph"]) {
      collect(record["@graph"]);
    }
  };

  $('script[type="application/ld+json"]').each((_, elem) => {
    try {
      collect(JSON.parse($(elem).text()));
    } catch (err) {
      // Ignore malformed structured data
    }
  });

  const organizations = records.filter((record) => {
    const types = Array.isArray(record["@type"])
      ? record["@type"]
      : [record["@type"]];

    return types.some(
      (type) =>
        typeof type === "string" &&
        /^(Organization|LocalBusiness)$/i.test(type),
    );
  });

  for (const organization of organizations) {
    const logo = organization.logo;

    if (typeof logo === "string") {
      const result = resolveUrl(logo, baseUrl);

      if (result) {
        return result;
      }
    }

    if (!logo || typeof logo !== "object") continue;

    const logoRecord = logo as JsonRecord;

    // Handle a directly embedded ImageObject
    const directUrl = logoRecord.url ?? logoRecord.contentUrl;

    if (typeof directUrl === "string") {
      const result = resolveUrl(directUrl, baseUrl);

      if (result) return result;
    }

    // Handle {'@id': '...'} references to another JSON-LD node
    if (typeof logoRecord["@id"] === "string") {
      const referenced = records.find(
        (record) => record["@id"] === logoRecord["@id"],
      );

      if (referenced) {
        const imageUrl = referenced.url ?? referenced.contentUrl;

        if (typeof imageUrl === "string") {
          const result = resolveUrl(imageUrl, baseUrl);

          if (result) return result;
        }
      }
    }
  }

  return undefined;
}

function getFavIcons($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const favicons = new Set<string>();

  $("link[rel][href]").each((_, elem) => {
    const rel = ($(elem).attr("rel") ?? "").toLowerCase().split(/\s+/);

    const isFavicon =
      rel.includes("icon") ||
      rel.includes("shortcut") ||
      rel.includes("apple-touch-icon") ||
      rel.includes("apple-touch-icon-precompressed") ||
      rel.includes("mask-icon");

    if (!isFavicon) return;

    const href = $(elem).attr("href");
    const resolved = resolveUrl(href, baseUrl);

    if (resolved) favicons.add(resolved);
  });

  // Standard fallback when the page declares no favicon
  if (favicons.size === 0) {
    const fallback = resolveUrl("/favicon.ico", baseUrl);

    if (fallback) favicons.add(fallback);
  }

  return [...favicons];
}

// Scrape for website metadata
export async function getWebsiteMetadata(
  website_url: string,
): Promise<WebsiteMetadata> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(website_url);

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are supported");
    }
  } catch (err) {
    throw new Error(`Invalid website URL: ${err}`);
  }

  try {
    const response = await fetch(parsedUrl, {
      signal: AbortSignal.timeout(15_000),
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WebsiteMetadataBot/1.0)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch website. Status: ${response.status}`);
    }

    const html = await response.text();

    const $ = await cheerio.load(html);

    // Use the final URL after HTTP redirects as the resolution base
    const baseUrl = response.url || parsedUrl.href;

    // Extract logo (Assuming logo image has a class="logo")
    const logo_url =
      getLogoFromDOM($, baseUrl) ??
      getLogoFromJsonLD($, baseUrl) ??
      resolveUrl(getMeta($, "property", "og:image"), baseUrl) ??
      resolveUrl(getMeta($, "name", "twitter:image"), baseUrl);

    const favicons = getFavIcons($, baseUrl);

    const title =
      getMeta($, "property", "og:title") ??
      normalizeText($("title").first().text());

    const subtitle = normalizeText(
      $("h1").first().text() ||
        $("h2").first().text() ||
        $("h3").first().text(),
    );

    const description =
      getMeta($, "name", "description") ??
      getMeta($, "property", "og:description") ??
      getMeta($, "name", "twitter:description") ??
      "";

    const rawKeywords =
      getMeta($, "name", "keywords") ??
      getMeta($, "property", "og:keywords") ??
      "";

    const keywords = rawKeywords
      .split(",")
      .map((kw) => kw.trim())
      .filter(Boolean);

    return {
      logo_url,
      favicons,
      title,
      subtitle,
      description,
      keywords,
    };
  } catch (err) {
    throw new Error(`Error scrapping the website: ${err}`);
  }
}
