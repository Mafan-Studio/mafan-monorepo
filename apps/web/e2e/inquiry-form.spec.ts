import { test, expect, type Page, type Request } from "@playwright/test";
import en from "../src/i18n/dictionaries/en.json";
import fa from "../src/i18n/dictionaries/fa.json";

// Minimal valid 1x1 transparent PNG, used as a fake upload — no fixture
// file needed on disk.
const TEST_IMAGE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

const mockApi = async (page: Page) => {
  const captured: { request?: Request } = {};
  await page.route("**/api/inquiries", async (route) => {
    captured.request = route.request();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true }),
    });
  });
  return captured;
};

// Mantine's FileInput labels the visible trigger button, not the hidden
// native <input type="file">, so target the real input directly.
const uploadDrawing = (page: Page) =>
  page.locator('input[type="file"]').setInputFiles({
    name: "drawing.png",
    mimeType: "image/png",
    buffer: TEST_IMAGE,
  });

test.describe("Inquiry form", () => {
  test("submits an English inquiry with email and all optional fields", async ({
    page,
  }) => {
    const captured = await mockApi(page);
    await page.goto("/en");

    await uploadDrawing(page);
    await expect(page.getByAltText(en.form.previewAlt)).toBeVisible();
    await page.getByLabel(en.form.emailLabel).fill("parent@example.com");
    await page.getByLabel(en.form.nameLabel).fill("Test Parent");
    await page.getByLabel(en.form.childNameLabel).fill("Mila");
    await page
      .getByLabel(en.form.messageLabel)
      .fill("Please keep the pink dress and the yellow crown.");
    await expect(page.getByText(en.form.privacy)).toBeVisible();

    await page.getByRole("button", { name: en.form.submit }).click();
    await expect(page.getByText(en.form.successTitle)).toBeVisible();

    const request = captured.request!;
    expect(request.headers()["content-type"]).toContain("multipart/form-data");
    const body = request.postData() ?? "";
    expect(body).toContain("parent@example.com");
    expect(body).toContain("Test Parent");
    expect(body).toContain("Mila");
    expect(body).toMatch(/name="locale"\r\n\r\nen/);
    expect(body).toContain('filename="drawing.png"');
  });

  test("submits a Persian inquiry with only an Instagram handle", async ({
    page,
  }) => {
    const captured = await mockApi(page);
    await page.goto("/fa");

    await uploadDrawing(page);
    await page.getByLabel(fa.form.instagramLabel).fill("@mila.draws");
    await page.getByRole("button", { name: fa.form.submit }).click();
    await expect(page.getByText(fa.form.successTitle)).toBeVisible();

    const body = captured.request!.postData() ?? "";
    expect(body).toMatch(/name="locale"\r\n\r\nfa/);
    expect(body).toMatch(/name="instagramHandle"\r\n\r\n@mila\.draws/);
    expect(body).not.toContain('name="email"');
  });

  test("shows validation messages in Persian instead of submitting", async ({
    page,
  }) => {
    const captured = await mockApi(page);
    await page.goto("/fa");

    await page.getByRole("button", { name: fa.form.submit }).click();
    await expect(page.getByText(fa.form.errors.contact_required)).toBeVisible();

    await page.getByLabel(fa.form.emailLabel).fill("not-an-email");
    await page.getByRole("button", { name: fa.form.submit }).click();
    await expect(page.getByText(fa.form.errors.invalid_email)).toBeVisible();

    expect(captured.request).toBeUndefined();
  });
});
