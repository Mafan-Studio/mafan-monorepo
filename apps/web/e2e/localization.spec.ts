import { test, expect } from "@playwright/test";

const redirectTarget = async (
  request: import("@playwright/test").APIRequestContext,
  headers: Record<string, string>,
) => {
  const response = await request.get("/", { headers, maxRedirects: 0 });
  expect(response.status()).toBe(307);
  return new URL(response.headers()["location"]!, "http://localhost").pathname;
};

test.describe("Language choice at /", () => {
  test("saved choice wins over browser language and country", async ({
    request,
  }) => {
    expect(
      await redirectTarget(request, {
        cookie: "NEXT_LOCALE=fa",
        "accept-language": "nl-NL,nl;q=0.9",
        "x-vercel-ip-country": "NL",
      }),
    ).toBe("/fa");
  });

  test("browser language comes before country", async ({ request }) => {
    expect(
      await redirectTarget(request, {
        "accept-language": "fa-IR,fa;q=0.9",
        "x-vercel-ip-country": "NL",
      }),
    ).toBe("/fa");
  });

  test("country fallback sends Dutch visitors to /nl", async ({ request }) => {
    expect(
      await redirectTarget(request, {
        "accept-language": "de-DE,de;q=0.9",
        "x-vercel-ip-country": "NL",
      }),
    ).toBe("/nl");
  });

  test("defaults to English", async ({ request }) => {
    expect(await redirectTarget(request, { "accept-language": "de-DE" })).toBe(
      "/en",
    );
  });
});

test.describe("Language pages", () => {
  test("a language URL is never redirected", async ({ browser }) => {
    const context = await browser.newContext({ locale: "nl-NL" });
    const page = await context.newPage();
    const response = await page.goto("/fa");
    expect(response?.status()).toBe(200);
    expect(page.url()).toMatch(/\/fa$/);
    await context.close();
  });

  test("Persian is right-to-left, English and Dutch left-to-right", async ({
    page,
  }) => {
    await page.goto("/fa");
    await expect(page.locator("html")).toHaveAttribute("lang", "fa");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.goto("/nl");
    await expect(page.locator("html")).toHaveAttribute("lang", "nl");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");

    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  });

  test("unsupported languages are not found", async ({ request }) => {
    const response = await request.get("/de");
    expect(response.status()).toBe(404);
  });

  test("pages declare their language alternates", async ({ page }) => {
    await page.goto("/nl");
    const alternates = page.locator('link[rel="alternate"][hreflang]');
    const byLang = Object.fromEntries(
      await alternates.evaluateAll((links) =>
        links.map((link) => [
          link.getAttribute("hreflang"),
          new URL(link.getAttribute("href")!).pathname,
        ]),
      ),
    );
    expect(byLang).toEqual({
      en: "/en",
      nl: "/nl",
      fa: "/fa",
      "x-default": "/",
    });
  });
});

test.describe("Language switcher", () => {
  test("switching saves the choice for later visits to /", async ({ page }) => {
    await page.goto("/nl");
    await page.getByRole("link", { name: "فارسی" }).click();
    await expect(page).toHaveURL(/\/fa$/);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");

    await page.goto("/");
    await expect(page).toHaveURL(/\/fa$/);
  });

  test("is visible without scrolling on a phone", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
    });
    const page = await context.newPage();
    await page.goto("/en");
    for (const name of ["English", "Nederlands", "فارسی"]) {
      await expect(page.getByRole("link", { name })).toBeInViewport();
    }
    await context.close();
  });
});
