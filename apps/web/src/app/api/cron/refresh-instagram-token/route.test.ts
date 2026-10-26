// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const db = vi.hoisted(() => ({
  token: "old-token" as string | null,
  updates: [] as Record<string, unknown>[],
  updateError: null as unknown,
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: db.token ? { access_token: db.token } : null,
            error: null,
          }),
        }),
      }),
      update: (values: Record<string, unknown>) => ({
        eq: async () => {
          db.updates.push(values);
          return { error: db.updateError };
        },
      }),
    }),
  },
}));

const { GET } = await import("./route");

const call = (authorization?: string) =>
  GET(
    new Request("http://localhost/api/cron/refresh-instagram-token", {
      headers: authorization ? { authorization } : {},
    }),
  );

const authorized = () => call("Bearer test-secret");

describe("GET /api/cron/refresh-instagram-token", () => {
  beforeEach(() => {
    vi.stubEnv("CRON_SECRET", "test-secret");
    db.token = "old-token";
    db.updates = [];
    db.updateError = null;
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects callers without the secret", async () => {
    vi.stubGlobal("fetch", vi.fn());

    expect((await call()).status).toBe(401);
    expect((await call("Bearer wrong")).status).toBe(401);
    expect(fetch).not.toHaveBeenCalled();
    expect(db.updates).toHaveLength(0);
  });

  it("rejects everyone when no secret is configured", async () => {
    vi.stubEnv("CRON_SECRET", "");
    expect((await call("Bearer ")).status).toBe(401);
  });

  it("does nothing when Instagram isn't connected yet", async () => {
    db.token = null;
    vi.stubGlobal("fetch", vi.fn());

    const response = await authorized();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, refreshed: false });
    expect(fetch).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it("stores the refreshed token with its new expiry", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: "new-token",
          token_type: "bearer",
          expires_in: 5_184_000,
        }),
      } as Response),
    );

    const response = await authorized();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, refreshed: true });

    const requestedUrl = new URL(String(vi.mocked(fetch).mock.calls[0]![0]));
    expect(requestedUrl.searchParams.get("access_token")).toBe("old-token");
    expect(requestedUrl.searchParams.get("grant_type")).toBe(
      "ig_refresh_token",
    );

    expect(db.updates).toHaveLength(1);
    const update = db.updates[0]!;
    expect(update.access_token).toBe("new-token");
    const daysUntilExpiry =
      (Date.parse(update.expires_at as string) - Date.now()) / 86_400_000;
    expect(daysUntilExpiry).toBeGreaterThan(59);
  });

  it("keeps the old token and logs when Instagram refuses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: { message: "Token expired" } }),
      } as Response),
    );

    const response = await authorized();
    expect(response.status).toBe(502);
    expect(db.updates).toHaveLength(0);
    expect(console.error).toHaveBeenCalled();
  });

  it("keeps the old token when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    expect((await authorized()).status).toBe(502);
    expect(db.updates).toHaveLength(0);
  });
});
