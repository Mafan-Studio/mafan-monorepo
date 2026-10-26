"use client";

import styled from "@emotion/styled";
import { SUPPORTED_LOCALES, type Locale } from "@mafan/types";
import { colors, radius, spacing } from "@mafan/tokens";
import { LOCALE_COOKIE, LOCALE_NAMES } from "@/i18n/locales";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Only an explicit choice here is remembered; opening a shared /fa link
// never changes a visitor's saved language.
const rememberLocaleChoice = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
};

const List = styled.ul`
  display: flex;
  gap: 2px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const LanguageLink = styled.a`
  display: inline-block;
  padding-block: 4px;
  padding-inline: ${spacing.xs};
  border-radius: ${radius.md};
  color: ${colors.neutral.secondaryInk};
  font-size: 15px;
  text-decoration: none;

  &:hover {
    background: ${colors.pink.soft};
  }

  @media (max-width: 30em) {
    padding-inline: 6px;
    font-size: 14px;
  }

  &[aria-current="true"] {
    background: ${colors.pink.base};
    color: ${colors.neutral.ink};
    font-weight: 600;
  }
`;

interface LanguageSwitcherProps {
  current: Locale;
  label: string;
}

export const LanguageSwitcher = ({ current, label }: LanguageSwitcherProps) => {
  return (
    <nav aria-label={label}>
      <List>
        {SUPPORTED_LOCALES.map((locale) => (
          <li key={locale}>
            <LanguageLink
              href={`/${locale}`}
              lang={locale}
              hrefLang={locale}
              aria-current={locale === current ? "true" : undefined}
              onClick={() => rememberLocaleChoice(locale)}
            >
              {LOCALE_NAMES[locale]}
            </LanguageLink>
          </li>
        ))}
      </List>
    </nav>
  );
};
