// @vitest-environment node
import { describe, it, expect } from "vitest";
import { parseRanges } from "@/lib/convert";

describe("parseRanges", () => {
  it("turns '1-3, 5' into two groups", () => {
    expect(parseRanges("1-3, 5", 10)).toEqual([[0, 1, 2], [4]]);
  });
  it("rejects pages beyond the document", () => {
    expect(() => parseRanges("2-12", 10)).toThrow("between 1 and 10");
  });
  it("rejects garbage", () => {
    expect(() => parseRanges("abc", 10)).toThrow();
  });
});
