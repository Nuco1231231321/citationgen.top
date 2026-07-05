import { describe, expect, it } from "vitest";
import { detectInput } from "@/lib/metadata/detect";

describe("detectInput", () => {
  it("detects DOI input", () => {
    expect(detectInput("https://doi.org/10.1021/jacs.5b01053")).toEqual({
      kind: "doi",
      value: "10.1021/jacs.5b01053"
    });
  });

  it("detects ISBN input", () => {
    expect(detectInput("978-0-262-03384-8")).toEqual({
      kind: "isbn",
      value: "9780262033848"
    });
  });

  it("detects public URL input", () => {
    expect(detectInput("https://example.com/article")).toEqual({
      kind: "url",
      value: "https://example.com/article"
    });
  });

  it("falls back to title search", () => {
    expect(detectInput("Conversion of Aldehyde to Alkane")).toEqual({
      kind: "title",
      value: "Conversion of Aldehyde to Alkane"
    });
  });
});
