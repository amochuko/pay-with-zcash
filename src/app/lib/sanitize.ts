import { convert } from "html-to-text";
import sanitizeHtml from "sanitize-html";

export function sanitizeContent(content: string | null | undefined) {
  if (!content) return "";

  // Remove all HTML elements and attributes.
  const sanitized = sanitizeHtml(content, {
    allowedTags: [
      "p",
      "br",
      "div",
      "ul",
      "ol",
      "li",
      "a",
      "strong",
      "b",
      "em",
      "i",
      "h1",
      "h2",
      "h3",
      "h4",
      "blockquote",
    ],
    allowedAttributes: {},
    disallowedTagsMode: "discard",
  });

  // Convert HTML into readable plain text.
  const text = convert(sanitized, {
    wordwrap: false,
    selectors: [
      {
        selector: "a",
        options: {
          ignoreHref: true,
        },
      },
      {
        selector: "ul",
        options: {
          itemPrefix: "• ",
        },
      },
      {
        selector: "ol",
        options: {
          itemPrefix: "• ",
        },
      },
    ],
  });

  // Normalize spaces without destroying line boundaries.
  return text
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
