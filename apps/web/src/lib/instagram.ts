import "server-only";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const INSTAGRAM_FEED_LIMIT = 9;
export const INSTAGRAM_REVALIDATE_SECONDS = 3600;

const GRAPH_URL = "https://graph.instagram.com";

export interface InstagramPost {
  id: string;
  imageUrl: string;
  permalink: string;
  isVideo: boolean;
}

interface GraphMediaItem {
  id?: unknown;
  media_type?: unknown;
  media_url?: unknown;
  thumbnail_url?: unknown;
  permalink?: unknown;
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.length > 0;

// Videos and Reels are shown as their thumbnail; carousels as their first
// image (which is what `media_url` holds for a carousel album).
const toPost = (item: GraphMediaItem): InstagramPost | null => {
  const isVideo = item.media_type === "VIDEO";
  const imageUrl = isVideo ? item.thumbnail_url : item.media_url;

  if (
    !isNonEmptyString(item.id) ||
    !isNonEmptyString(imageUrl) ||
    !isNonEmptyString(item.permalink)
  ) {
    return null;
  }

  return { id: item.id, imageUrl, permalink: item.permalink, isVideo };
};

export const getInstagramAccessToken = async (): Promise<string | null> => {
  const { data, error } = await supabaseAdmin
    .from("instagram_credentials")
    .select("access_token")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error("Failed to read Instagram credentials", error);
    return null;
  }

  return data?.access_token ?? null;
};

/**
 * Latest posts for the landing page feed. Never throws: any failure yields
 * an empty list, and the feed then shows only its "follow us" link. With no
 * token stored yet (Instagram not connected), it returns quietly without
 * calling Instagram.
 */
export const getInstagramPosts = async (): Promise<InstagramPost[]> => {
  try {
    const token = await getInstagramAccessToken();
    if (!token) {
      return [];
    }

    const url = new URL(`${GRAPH_URL}/me/media`);
    url.searchParams.set(
      "fields",
      "id,media_type,media_url,thumbnail_url,permalink,timestamp",
    );
    url.searchParams.set("limit", String(INSTAGRAM_FEED_LIMIT));
    url.searchParams.set("access_token", token);

    const response = await fetch(url, {
      next: { revalidate: INSTAGRAM_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error("Instagram media request failed", response.status);
      return [];
    }

    const body: unknown = await response.json();
    const items =
      body && typeof body === "object" && "data" in body ? body.data : null;

    if (!Array.isArray(items)) {
      console.error("Unexpected Instagram media response");
      return [];
    }

    return items
      .map((item: GraphMediaItem) => toPost(item))
      .filter((post): post is InstagramPost => post !== null)
      .slice(0, INSTAGRAM_FEED_LIMIT);
  } catch (error) {
    console.error("Failed to load Instagram posts", error);
    return [];
  }
};
