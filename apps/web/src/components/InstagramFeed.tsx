"use client";

import styled from "@emotion/styled";
import NextImage from "next/image";
import { Button, Container, SimpleGrid, Stack, Title } from "@mantine/core";
import { colors, radius } from "@mafan/tokens";
import { INSTAGRAM_PROFILE_URL } from "@/content/site";
import type { Dictionary } from "@/i18n/getDictionary";
import type { InstagramPost } from "@/lib/instagram";
import { InstagramIcon } from "./InstagramIcon";
import { Section } from "./Section";

const Tile = styled.a`
  position: relative;
  display: block;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: ${radius.md};
  background: ${colors.pink.soft};

  img {
    object-fit: cover;
    transition: transform 200ms ease;
  }

  &:hover img {
    transform: scale(1.04);
  }
`;

const VideoBadge = styled.span`
  position: absolute;
  inset-block-start: 8px;
  inset-inline-end: 8px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(26, 26, 46, 0.7);
  color: ${colors.neutral.white};
  font-size: 12px;
`;

interface InstagramFeedProps {
  posts: InstagramPost[];
  strings: Dictionary["instagram"];
}

export const InstagramFeed = ({ posts, strings }: InstagramFeedProps) => (
  <Section tone="cream" aria-labelledby="instagram-title">
    <Container size="md">
      <Stack align="center" gap="lg">
        <Title order={2} id="instagram-title" ta="center">
          {strings.title}
        </Title>
        {posts.length > 0 && (
          <SimpleGrid cols={3} spacing={{ base: 6, sm: "sm" }} w="100%">
            {posts.map((post) => (
              <Tile
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* Unoptimized: Instagram signs these URLs and expires them,
                    so they must not be cached by the image optimizer. */}
                <NextImage
                  src={post.imageUrl}
                  alt={strings.postAlt}
                  fill
                  unoptimized
                  sizes="(max-width: 48em) 33vw, 300px"
                />
                {post.isVideo && (
                  <VideoBadge aria-label={strings.videoLabel} role="img">
                    ▶
                  </VideoBadge>
                )}
              </Tile>
            ))}
          </SimpleGrid>
        )}
        <Button
          component="a"
          href={INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          variant="outline"
          color="dark"
          radius="xl"
          leftSection={<InstagramIcon size={18} />}
        >
          {strings.follow}
        </Button>
      </Stack>
    </Container>
  </Section>
);
