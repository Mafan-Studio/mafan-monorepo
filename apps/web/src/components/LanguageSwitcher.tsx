"use client";

import { Button, Menu } from "@mantine/core";
import { SUPPORTED_LOCALES, type Locale } from "@mafan/types";
import { colors } from "@mafan/tokens";
import { LOCALE_COOKIE, LOCALE_NAMES } from "@/i18n/locales";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

// Only an explicit choice here is remembered; opening a shared /fa link
// never changes a visitor's saved language.
const rememberLocaleChoice = (locale: Locale) => {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
};

const GlobeIcon = () => (
  <svg
    width={18}
    height={18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    width={14}
    height={14}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

interface LanguageSwitcherProps {
  current: Locale;
  label: string;
}

export const LanguageSwitcher = ({ current, label }: LanguageSwitcherProps) => (
  <Menu position="bottom-end" radius="md" shadow="md" width={160}>
    <Menu.Target>
      <Button
        variant="subtle"
        color="dark"
        radius="xl"
        px="sm"
        aria-label={`${label}: ${LOCALE_NAMES[current]}`}
        leftSection={<GlobeIcon />}
        rightSection={<ChevronIcon />}
      >
        <span lang={current}>{LOCALE_NAMES[current]}</span>
      </Button>
    </Menu.Target>
    <Menu.Dropdown>
      {SUPPORTED_LOCALES.map((locale) => (
        <Menu.Item
          key={locale}
          component="a"
          href={`/${locale}`}
          lang={locale}
          hrefLang={locale}
          aria-current={locale === current ? "true" : undefined}
          onClick={() => rememberLocaleChoice(locale)}
          fw={locale === current ? 600 : 400}
          bg={locale === current ? colors.pink.soft : undefined}
        >
          {LOCALE_NAMES[locale]}
        </Menu.Item>
      ))}
    </Menu.Dropdown>
  </Menu>
);
