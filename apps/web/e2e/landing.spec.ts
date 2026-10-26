import { test, expect } from "@playwright/test";
import en from "../src/i18n/dictionaries/en.json";
import { INSTAGRAM_DM_URL, INSTAGRAM_PROFILE_URL } from "../src/content/site";

test.describe("Landing page", () => {
  test("shows every section in order", async ({ page }) => {
    await page.goto("/en");

    const headings = await page
      .getByRole("heading", { level: 2 })
      .allTextContents();
    expect(headings).toEqual([
      en.showcase.title,
      en.howItWorks.title,
      en.about.title,
      en.instagram.title,
      en.faq.title,
      en.contact.title,
    ]);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      en.hero.title,
    );
  });

  test("hero actions point at the form and an Instagram DM", async ({
    page,
  }) => {
    await page.goto("/en");

    const formLink = page.getByRole("link", { name: en.hero.ctaForm });
    await expect(formLink).toHaveAttribute("href", "#inquiry");
    await formLink.click();
    await expect(page.locator("#inquiry")).toBeInViewport();

    const dmLink = page.getByRole("link", { name: en.hero.ctaInstagram });
    await expect(dmLink).toHaveAttribute("href", INSTAGRAM_DM_URL);
    await expect(dmLink).toHaveAttribute("target", "_blank");
  });

  test("shows three drawing/keepsake pairs, drawing first", async ({
    page,
  }) => {
    await page.goto("/en");
    for (const item of Object.values(en.showcase.items)) {
      await expect(page.getByAltText(item.drawingAlt)).toBeVisible();
      await expect(page.getByAltText(item.sculptureAlt)).toBeVisible();
    }
  });

  test("states the timing, shows no prices and answers FAQs", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.getByText(en.howItWorks.timing)).toBeVisible();
    await expect(page.locator("body")).not.toContainText("€");

    const priceQuestion = en.faq.items[2]!;
    await page.getByRole("button", { name: priceQuestion.question }).click();
    await expect(page.getByText(priceQuestion.answer)).toBeVisible();
  });

  test("Instagram section falls back to the follow link when not connected", async ({
    page,
  }) => {
    await page.goto("/en");
    const follow = page.getByRole("link", { name: en.instagram.follow });
    await expect(follow).toHaveAttribute("href", INSTAGRAM_PROFILE_URL);
  });

  test("has no horizontal scroll on a phone in any language", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: 375, height: 667 },
    });
    const page = await context.newPage();
    for (const lang of ["en", "nl", "fa"]) {
      await page.goto(`/${lang}`);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, `horizontal overflow on /${lang}`).toBeLessThanOrEqual(
        0,
      );
    }
    await context.close();
  });
});
