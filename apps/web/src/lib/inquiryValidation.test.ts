import { describe, it, expect } from "vitest";
import {
  isLocale,
  isValidEmail,
  isValidInstagramHandle,
  normalizeInstagramHandle,
} from "@mafan/types";

describe("Instagram handle validation", () => {
  it.each(["mila.draws", "@mila.draws", "a", "under_score", "x".repeat(30)])(
    "accepts %s",
    (handle) => {
      expect(isValidInstagramHandle(handle)).toBe(true);
    },
  );

  it.each(["", "@", "has space", "dash-name", "x".repeat(31), "émile"])(
    "rejects %s",
    (handle) => {
      expect(isValidInstagramHandle(handle)).toBe(false);
    },
  );

  it("strips a leading @ and surrounding whitespace", () => {
    expect(normalizeInstagramHandle("  @mila.draws ")).toBe("mila.draws");
    expect(normalizeInstagramHandle("mila.draws")).toBe("mila.draws");
  });
});

describe("email validation", () => {
  it("accepts a normal address", () => {
    expect(isValidEmail("parent@example.com")).toBe(true);
  });

  it.each(["not-an-email", "a@b", "a b@c.d", ""])("rejects %s", (email) => {
    expect(isValidEmail(email)).toBe(false);
  });
});

describe("isLocale", () => {
  it("accepts only supported locales", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("nl")).toBe(true);
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });
});
