import { act, fireEvent, render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { afterEach, describe, expect, it } from "vitest";
import en from "@/i18n/dictionaries/en.json";
import {
  ANALYTICS_CONSENT_COOKIE,
  openCookieSettings,
  readAnalyticsConsent,
} from "@/lib/consent";
import { CookieConsent } from "./CookieConsent";

const renderBanner = () =>
  render(
    <MantineProvider>
      <CookieConsent lang="en" strings={en.cookies} loadAnalytics={false} />
    </MantineProvider>,
  );

afterEach(() => {
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=; path=/; max-age=0`;
});

describe("CookieConsent", () => {
  it("asks first-time visitors and remembers an accept", () => {
    renderBanner();

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    expect(readAnalyticsConsent()).toBe("granted");
    expect(screen.queryByText(en.cookies.message)).not.toBeInTheDocument();
  });

  it("remembers a decline", () => {
    renderBanner();

    fireEvent.click(screen.getByRole("button", { name: "Decline" }));

    expect(readAnalyticsConsent()).toBe("denied");
  });

  it("stays hidden once answered, until cookie settings are reopened", () => {
    document.cookie = `${ANALYTICS_CONSENT_COOKIE}=denied; path=/`;
    renderBanner();

    expect(
      screen.queryByRole("button", { name: "Accept" }),
    ).not.toBeInTheDocument();

    act(() => openCookieSettings());

    expect(screen.getByRole("button", { name: "Accept" })).toBeInTheDocument();
  });
});
