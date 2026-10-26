// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const db = vi.hoisted(() => ({
  recentCount: 0,
  rateLimitError: null as unknown,
  uploadError: null as unknown,
  insertError: null as unknown,
  inserted: [] as Record<string, unknown>[],
  uploaded: [] as string[],
}));

vi.mock("@/lib/supabaseAdmin", () => {
  const rateLimitQuery = {
    eq: () => rateLimitQuery,
    gte: async () => ({ count: db.recentCount, error: db.rateLimitError }),
  };
  return {
    supabaseAdmin: {
      from: () => ({
        select: () => rateLimitQuery,
        insert: async (row: Record<string, unknown>) => {
          db.inserted.push(row);
          return { error: db.insertError };
        },
      }),
      storage: {
        from: () => ({
          upload: async (path: string) => {
            db.uploaded.push(path);
            return { error: db.uploadError };
          },
        }),
      },
    },
  };
});

const { POST } = await import("./route");

const pngFile = (size = 16) =>
  new File([new Uint8Array(size)], "drawing.png", { type: "image/png" });

const submit = (fields: Record<string, string | File>) => {
  const body = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    body.append(key, value);
  }
  return POST(
    new Request("http://localhost/api/inquiries", {
      method: "POST",
      body,
      headers: { "x-forwarded-for": "203.0.113.7" },
    }),
  );
};

const expectError = async (
  response: Response,
  status: number,
  code: string,
) => {
  expect(response.status).toBe(status);
  expect(await response.json()).toEqual({ error: code });
  expect(db.inserted).toHaveLength(0);
};

describe("POST /api/inquiries", () => {
  beforeEach(() => {
    db.recentCount = 0;
    db.rateLimitError = null;
    db.uploadError = null;
    db.insertError = null;
    db.inserted = [];
    db.uploaded = [];
  });

  it("stores a handle-only inquiry with its locale", async () => {
    const response = await submit({
      instagramHandle: "@mila.draws",
      locale: "fa",
      image: pngFile(),
    });

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(db.inserted).toEqual([
      expect.objectContaining({
        instagram_handle: "mila.draws",
        email: undefined,
        name: undefined,
        locale: "fa",
        ip_address: "203.0.113.7",
      }),
    ]);
    expect(db.uploaded).toHaveLength(1);
  });

  it("stores all provided fields and falls back to en for an unknown locale", async () => {
    await submit({
      name: "Test Parent",
      email: "parent@example.com",
      childName: "Mila",
      message: "Keep the crown",
      locale: "de",
      image: pngFile(),
    });

    expect(db.inserted[0]).toMatchObject({
      name: "Test Parent",
      email: "parent@example.com",
      child_name: "Mila",
      message: "Keep the crown",
      locale: "en",
    });
  });

  it("silently accepts and drops honeypot submissions", async () => {
    const response = await submit({
      email: "bot@example.com",
      company: "Spam Inc",
      image: pngFile(),
    });

    expect(await response.json()).toEqual({ ok: true });
    expect(db.inserted).toHaveLength(0);
    expect(db.uploaded).toHaveLength(0);
  });

  it("rejects past the rate limit", async () => {
    db.recentCount = 3;
    await expectError(
      await submit({ email: "parent@example.com", image: pngFile() }),
      429,
      "rate_limited",
    );
  });

  it("requires an email or Instagram handle", async () => {
    await expectError(
      await submit({ name: "Test Parent", image: pngFile() }),
      400,
      "contact_required",
    );
  });

  it("rejects an invalid email", async () => {
    await expectError(
      await submit({ email: "not-an-email", image: pngFile() }),
      400,
      "invalid_email",
    );
  });

  it("rejects an invalid Instagram handle", async () => {
    await expectError(
      await submit({ instagramHandle: "has space", image: pngFile() }),
      400,
      "invalid_instagram",
    );
  });

  it("rejects an oversized message", async () => {
    await expectError(
      await submit({
        email: "parent@example.com",
        message: "x".repeat(5000),
        image: pngFile(),
      }),
      400,
      "field_too_long",
    );
  });

  it("requires an image", async () => {
    await expectError(
      await submit({ email: "parent@example.com" }),
      400,
      "image_required",
    );
  });

  it("rejects a non-image file", async () => {
    await expectError(
      await submit({
        email: "parent@example.com",
        image: new File(["%PDF"], "drawing.pdf", { type: "application/pdf" }),
      }),
      400,
      "image_type",
    );
  });

  it("rejects an image over 8MB", async () => {
    await expectError(
      await submit({
        email: "parent@example.com",
        image: pngFile(8 * 1024 * 1024 + 1),
      }),
      400,
      "image_too_large",
    );
  });

  it("reports a server error when the upload fails", async () => {
    db.uploadError = new Error("storage down");
    await expectError(
      await submit({ email: "parent@example.com", image: pngFile() }),
      500,
      "server_error",
    );
  });

  it("reports a server error when storing the inquiry fails", async () => {
    db.insertError = new Error("db down");
    const response = await submit({
      email: "parent@example.com",
      image: pngFile(),
    });
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: "server_error" });
  });
});
