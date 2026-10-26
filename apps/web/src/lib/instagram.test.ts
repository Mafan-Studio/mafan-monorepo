// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

const db = vi.hoisted(() => ({
  token: "test-token" as string | null,
  readError: null as unknown,
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/supabaseAdmin", () => ({
  supabaseAdmin: {
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: db.token ? { access_token: db.token } : null,
            error: db.readError,
          }),
        }),
      }),
    }),
  },
}));

const { getInstagramPosts } = await import("./instagram");

const mockFetchJson = (body: unknown, ok = true) =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 400,
      json: async () => body,
    } as Response),
  );

describe("getInstagramPosts", () => {
  beforeEach(() => {
    db.token = "test-token";
    db.readError = null;
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("maps images, videos and carousels to posts", async () => {
    mockFetchJson({
      data: [
        {
          id: "1",
          media_type: "IMAGE",
          media_url: "https://scontent.cdninstagram.com/1.jpg",
          permalink: "https://www.instagram.com/p/1/",
        },
        {
          id: "2",
          media_type: "VIDEO",
          media_url: "https://scontent.cdninstagram.com/2.mp4",
          thumbnail_url: "https://scontent.cdninstagram.com/2.jpg",
          permalink: "https://www.instagram.com/reel/2/",
        },
        {
          id: "3",
          media_type: "CAROUSEL_ALBUM",
          media_url: "https://scontent.cdninstagram.com/3.jpg",
          permalink: "https://www.instagram.com/p/3/",
        },
      ],
    });

    expect(await getInstagramPosts()).toEqual([
      {
        id: "1",
        imageUrl: "https://scontent.cdninstagram.com/1.jpg",
        permalink: "https://www.instagram.com/p/1/",
        isVideo: false,
      },
      {
        id: "2",
        imageUrl: "https://scontent.cdninstagram.com/2.jpg",
        permalink: "https://www.instagram.com/reel/2/",
        isVideo: true,
      },
      {
        id: "3",
        imageUrl: "https://scontent.cdninstagram.com/3.jpg",
        permalink: "https://www.instagram.com/p/3/",
        isVideo: false,
      },
    ]);

    const requestedUrl = new URL(String(vi.mocked(fetch).mock.calls[0]![0]));
    expect(requestedUrl.pathname).toBe("/me/media");
    expect(requestedUrl.searchParams.get("limit")).toBe("9");
    expect(requestedUrl.searchParams.get("access_token")).toBe("test-token");
  });

  it("caps the feed at 9 posts and skips incomplete items", async () => {
    mockFetchJson({
      data: [
        { id: "broken", media_type: "IMAGE", permalink: "https://x/" },
        ...Array.from({ length: 12 }, (_, index) => ({
          id: String(index),
          media_type: "IMAGE",
          media_url: `https://scontent.cdninstagram.com/${index}.jpg`,
          permalink: `https://www.instagram.com/p/${index}/`,
        })),
      ],
    });

    const posts = await getInstagramPosts();
    expect(posts).toHaveLength(9);
    expect(posts[0]!.id).toBe("0");
  });

  it("returns nothing on an HTTP error", async () => {
    mockFetchJson({ error: { message: "Invalid token" } }, false);
    expect(await getInstagramPosts()).toEqual([]);
  });

  it("returns nothing on malformed data", async () => {
    mockFetchJson({ unexpected: true });
    expect(await getInstagramPosts()).toEqual([]);
  });

  it("returns nothing when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await getInstagramPosts()).toEqual([]);
  });

  it("quietly returns nothing when Instagram isn't connected yet", async () => {
    db.token = null;
    vi.stubGlobal("fetch", vi.fn());

    expect(await getInstagramPosts()).toEqual([]);
    expect(fetch).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
