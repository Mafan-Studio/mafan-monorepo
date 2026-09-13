import { test, expect } from "@playwright/test";

// Minimal valid 1x1 transparent PNG, used as a fake upload — no fixture
// file needed on disk.
const TEST_IMAGE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

test.describe("Inquiry form", () => {
  test("fills out, uploads a photo, and submits successfully", async ({
    page,
  }) => {
    let request: import("@playwright/test").Request | undefined;
    await page.route("**/api/inquiries", async (route) => {
      request = route.request();
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto("/");

    await page.getByLabel("Your name", { exact: false }).fill("Test Parent");
    await page.getByLabel("Email", { exact: false }).fill("parent@example.com");
    await page.getByLabel("Child's first name (optional)").fill("Mila");
    await page
      .getByLabel("Tell us about the drawing")
      .fill("Please keep the pink dress and the yellow crown.");
    // Mantine's FileInput labels the visible trigger button, not the
    // hidden native <input type="file">, so target the real input directly.
    await page.locator('input[type="file"]').setInputFiles({
      name: "drawing.png",
      mimeType: "image/png",
      buffer: TEST_IMAGE,
    });

    // Preview shows up before submitting.
    await expect(
      page.getByAltText("Preview of the uploaded drawing"),
    ).toBeVisible();

    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("We've received your drawing!")).toBeVisible();

    expect(request).toBeDefined();
    expect(request!.headers()["content-type"]).toContain("multipart/form-data");
    const body = request!.postData() ?? "";
    expect(body).toContain("Test Parent");
    expect(body).toContain("parent@example.com");
    expect(body).toContain("Mila");
    expect(body).toContain('name="image"');
    expect(body).toContain('filename="drawing.png"');
  });

  test("shows field validation errors instead of submitting", async ({
    page,
  }) => {
    let requestMade = false;
    await page.route("**/api/inquiries", async (route) => {
      requestMade = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.goto("/");

    await page.getByLabel("Email", { exact: false }).fill("not-an-email");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Please enter your name")).toBeVisible();
    await expect(page.getByText("Please enter a valid email")).toBeVisible();
    expect(requestMade).toBe(false);
  });

  test("requires a photo even when the other fields are valid", async ({
    page,
  }) => {
    let requestMade = false;
    await page.route("**/api/inquiries", async (route) => {
      requestMade = true;
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.goto("/");

    await page.getByLabel("Your name", { exact: false }).fill("Test Parent");
    await page.getByLabel("Email", { exact: false }).fill("parent@example.com");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Please upload a photo of the drawing"),
    ).toBeVisible();
    expect(requestMade).toBe(false);
  });
});
