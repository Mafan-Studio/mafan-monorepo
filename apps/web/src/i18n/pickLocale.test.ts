import { describe, it, expect } from "vitest";
import { pickLocale } from "./pickLocale";

describe("pickLocale", () => {
  it("prefers the saved choice over browser language and country", () => {
    expect(
      pickLocale({
        cookie: "fa",
        acceptLanguage: "nl-NL,nl;q=0.9",
        country: "NL",
      }),
    ).toBe("fa");
  });

  it("ignores an invalid saved choice", () => {
    expect(
      pickLocale({ cookie: "de", acceptLanguage: "nl", country: null }),
    ).toBe("nl");
  });

  it("uses browser language before country", () => {
    expect(
      pickLocale({ cookie: null, acceptLanguage: "fa", country: "NL" }),
    ).toBe("fa");
  });

  it("maps regional variants to the supported language", () => {
    expect(pickLocale({ acceptLanguage: "nl-BE" })).toBe("nl");
    expect(pickLocale({ acceptLanguage: "fa-IR,fa;q=0.9" })).toBe("fa");
  });

  it("respects browser preference order and quality values", () => {
    expect(
      pickLocale({ acceptLanguage: "de-DE,de;q=0.9,fa;q=0.8,en;q=0.7" }),
    ).toBe("fa");
  });

  it("falls back to Dutch in the Netherlands when no browser language is supported", () => {
    expect(
      pickLocale({ acceptLanguage: "de-DE,de;q=0.9", country: "NL" }),
    ).toBe("nl");
  });

  it("defaults to English elsewhere", () => {
    expect(pickLocale({ acceptLanguage: "de-DE", country: "DE" })).toBe("en");
  });

  it("defaults to English with no information at all", () => {
    expect(pickLocale({})).toBe("en");
  });

  it("treats a missing country as unknown", () => {
    expect(pickLocale({ acceptLanguage: "de", country: undefined })).toBe("en");
  });

  it("survives a malformed Accept-Language header", () => {
    expect(pickLocale({ acceptLanguage: ";;;,,", country: "NL" })).toBe("nl");
  });
});
