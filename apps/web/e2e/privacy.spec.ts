import { test, expect } from "@playwright/test";
import en from "../src/i18n/dictionaries/en.json";
import nl from "../src/i18n/dictionaries/nl.json";
import fa from "../src/i18n/dictionaries/fa.json";

const dictionaries = { en, nl, fa } as const;

test.describe("Privacy statement", () => {
  for (const [lang, dictionary] of Object.entries(dictionaries)) {
    test(`is reachable from the footer on /${lang}`, async ({ page }) => {
      await page.goto(`/${lang}`);
      const link = page
        .locator("footer")
        .getByRole("link", { name: dictionary.footer.privacyLink });
      await expect(link).toHaveAttribute("href", `/${lang}/privacy`);

      // Open the link's target directly: on the dev server, a first-compile
      // reload can swallow a click, which says nothing about the site.
      await page.goto((await link.getAttribute("href"))!);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        dictionary.privacy.title,
      );
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
    });
  }

  test("is linked from the inquiry form", async ({ page }) => {
    await page.goto("/en");
    await expect(
      page.getByRole("link", { name: en.form.privacyLink }),
    ).toHaveAttribute("href", "/en/privacy");
  });

  test("declares its language alternates", async ({ page }) => {
    await page.goto("/nl/privacy");
    const byLang = Object.fromEntries(
      await page
        .locator('link[rel="alternate"][hreflang]')
        .evaluateAll((links) =>
          links.map((link) => [
            link.getAttribute("hreflang"),
            new URL(link.getAttribute("href")!).pathname,
          ]),
        ),
    );
    expect(byLang).toMatchObject({
      en: "/en/privacy",
      nl: "/nl/privacy",
      fa: "/fa/privacy",
    });
  });
});
