"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import styled from "@emotion/styled";
import { Anchor, Button, Group, Text } from "@mantine/core";
import { colors, spacing } from "@mafan/tokens";
import type { Locale } from "@mafan/types";
import {
  OPEN_COOKIE_SETTINGS_EVENT,
  clearGoogleAnalyticsCookies,
  readAnalyticsConsent,
  saveAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/consent";
import type { Dictionary } from "@/i18n/getDictionary";

export const GA_MEASUREMENT_ID = "G-J4CN8W0G52";

const Banner = styled.section`
  position: fixed;
  inset-inline: ${spacing.sm};
  bottom: ${spacing.sm};
  z-index: 200;
  max-width: 560px;
  margin-inline: auto;
  padding: ${spacing.md};
  background: ${colors.neutral.warmWhite};
  color: ${colors.neutral.ink};
  border: 1px solid ${colors.neutral.border};
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(26, 26, 46, 0.12);
`;

interface CookieConsentProps {
  lang: Locale;
  strings: Dictionary["cookies"];
  // Only the production site reports to Google Analytics; previews and
  // local dev still show the banner so it can be reviewed.
  loadAnalytics: boolean;
}

export const CookieConsent = ({
  lang,
  strings,
  loadAnalytics,
}: CookieConsentProps) => {
  // null until the saved answer is read after mount, so the server render
  // and the first client render match.
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = readAnalyticsConsent();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the cookie is only readable in the browser
    setConsent(saved);
    setOpen(saved === null);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const choose = (choice: AnalyticsConsent) => {
    saveAnalyticsConsent(choice);
    setOpen(false);
    if (consent === "granted" && choice === "denied") {
      // gtag.js is already running; a reload is the only way to stop it.
      clearGoogleAnalyticsCookies();
      window.location.reload();
      return;
    }
    setConsent(choice);
  };

  return (
    <>
      {loadAnalytics && consent === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'granted',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied'
});
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
      {open && (
        <Banner aria-label={strings.title}>
          <Text fw={600} mb={4}>
            {strings.title}
          </Text>
          <Text size="sm" c={colors.neutral.secondaryInk}>
            {strings.message}{" "}
            <Anchor href={`/${lang}/privacy`} size="sm">
              {strings.privacyLink}
            </Anchor>
          </Text>
          {/* Saying no is as easy as saying yes, as Dutch rules require. */}
          <Group gap="sm" mt="md">
            <Button radius="xl" onClick={() => choose("granted")}>
              {strings.accept}
            </Button>
            <Button
              radius="xl"
              variant="outline"
              color="dark"
              onClick={() => choose("denied")}
            >
              {strings.decline}
            </Button>
          </Group>
        </Banner>
      )}
    </>
  );
};
