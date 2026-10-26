import { render, screen } from "@testing-library/react";
import { MantineProvider } from "@mantine/core";
import { describe, it, expect } from "vitest";
import fa from "@/i18n/dictionaries/fa.json";
import { INSTAGRAM_PROFILE_URL } from "@/content/site";
import { InstagramFeed } from "./InstagramFeed";

const renderFeed = (posts: Parameters<typeof InstagramFeed>[0]["posts"]) =>
  render(
    <MantineProvider>
      <InstagramFeed posts={posts} strings={fa.instagram} />
    </MantineProvider>,
  );

describe("InstagramFeed", () => {
  it("links each post to Instagram with translated alt text and marks videos", () => {
    renderFeed([
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
    ]);

    const images = screen.getAllByAltText(fa.instagram.postAlt);
    expect(images).toHaveLength(2);
    expect(images[0]!.closest("a")).toHaveAttribute(
      "href",
      "https://www.instagram.com/p/1/",
    );
    expect(
      screen.getAllByRole("img", { name: fa.instagram.videoLabel }),
    ).toHaveLength(1);
    expect(
      screen.getByRole("link", { name: fa.instagram.follow }),
    ).toHaveAttribute("href", INSTAGRAM_PROFILE_URL);
  });

  it("shows only the follow link when there are no posts", () => {
    renderFeed([]);

    expect(screen.queryAllByAltText(fa.instagram.postAlt)).toHaveLength(0);
    expect(
      screen.getByRole("link", { name: fa.instagram.follow }),
    ).toBeVisible();
  });
});
