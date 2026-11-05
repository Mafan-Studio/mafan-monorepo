// The visitor's answer to the analytics cookie question. Remembering the
// answer is itself strictly necessary, so this cookie needs no consent.
export const ANALYTICS_CONSENT_COOKIE = "mafan_analytics_consent";

// Fired by the footer's "Cookie settings" link to reopen the banner.
export const OPEN_COOKIE_SETTINGS_EVENT = "mafan:open-cookie-settings";

export type AnalyticsConsent = "granted" | "denied";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const readAnalyticsConsent = (): AnalyticsConsent | null => {
  const value = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split("=")[1];
  return value === "granted" || value === "denied" ? value : null;
};

export const saveAnalyticsConsent = (consent: AnalyticsConsent) => {
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${consent}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
};

// Google Analytics sets _ga and _ga_<id> on the widest domain it can
// (.mafan.studio, not www.mafan.studio), so expire them at every level.
export const clearGoogleAnalyticsCookies = () => {
  const hostParts = window.location.hostname.split(".");
  const domains = hostParts.map((_, i) => hostParts.slice(i).join("."));

  document.cookie
    .split("; ")
    .map((entry) => entry.split("=")[0])
    .filter((name) => name === "_ga" || name.startsWith("_ga_"))
    .forEach((name) => {
      document.cookie = `${name}=; path=/; max-age=0`;
      domains.forEach((domain) => {
        document.cookie = `${name}=; path=/; max-age=0; domain=${domain}`;
      });
    });
};
