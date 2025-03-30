import {
  convertToTitleCase,
  formatDateToHumanReadable,
  trimText,
} from "../string";

describe("Utils", () => {
  it("should return a Title Case of the str", () => {
    const txt = "this is it";
    const str = convertToTitleCase(txt);

    expect(str).toBe("This Is It");
  });

  it("should return a Text of specified length", () => {
    const txt = "Karen Harrod is an artist and the time it takes to create";
    const result = trimText(txt, 8);

    expect(result).toBe("Karen Ha...");
  });

  it("should return date as March, 27, 2025", () => {
    const date =
      "Thu Mar 27 2025 16:02:51 GMT+0100 (West Africa Standard Time)";
    const expected = "March 27, 2025";
    const result = formatDateToHumanReadable(date);

    expect(result).toBe(expected);
  });
});
