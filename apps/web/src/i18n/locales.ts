import type { Locale } from "@mafan/types";

export const getDirection = (locale: Locale): "ltr" | "rtl" =>
  locale === "fa" ? "rtl" : "ltr";

// Each language's name, written in its own script, for the switcher.
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  nl: "Nederlands",
  fa: "فارسی",
};

// Remembers a language picked in the switcher; read by the proxy on "/".
export const LOCALE_COOKIE = "NEXT_LOCALE";
