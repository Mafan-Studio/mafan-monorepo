import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  isLocale,
  type Locale,
} from "@mafan/types";

interface PickLocaleInput {
  cookie?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}

const fromAcceptLanguage = (acceptLanguage: string): Locale | null => {
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  })
    .languages()
    .filter((language) => language !== "*");

  if (languages.length === 0) {
    return null;
  }

  try {
    // A sentinel default tells "no supported match" apart from a real "en".
    const matched = match(languages, [...SUPPORTED_LOCALES], "none");
    return isLocale(matched) ? matched : null;
  } catch {
    // Malformed language tags make the matcher throw.
    return null;
  }
};

/**
 * Chooses the language for a visitor landing on "/": their saved choice,
 * then their browser's preferred languages, then Dutch for visitors in the
 * Netherlands, then English.
 */
export const pickLocale = ({
  cookie,
  acceptLanguage,
  country,
}: PickLocaleInput): Locale => {
  if (isLocale(cookie)) {
    return cookie;
  }

  if (acceptLanguage) {
    const browserLocale = fromAcceptLanguage(acceptLanguage);
    if (browserLocale) {
      return browserLocale;
    }
  }

  if (country?.toUpperCase() === "NL") {
    return "nl";
  }

  return DEFAULT_LOCALE;
};
