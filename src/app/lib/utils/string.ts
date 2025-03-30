export function convertToTitleCase(str: string) {
  return str
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function trimText(txt: string, length: number) {
  return txt && txt.slice(0, length) + "...";
}
