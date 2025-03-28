import { convertToTitleCase } from "../string";

describe("Utils", () => {
  it("should return a Title Case of the str", () => {
    const txt = "this is it";
    const str = convertToTitleCase(txt);

    expect(str).toBe("This Is It");
  });
});
