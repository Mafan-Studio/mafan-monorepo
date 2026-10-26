"use client";

import styled from "@emotion/styled";
import { Anchor, Container, Group, Text } from "@mantine/core";
import { colors, spacing } from "@mafan/tokens";
import { CONTACT_EMAIL, INSTAGRAM_PROFILE_URL } from "@/content/site";
import type { Dictionary } from "@/i18n/getDictionary";

const Bar = styled.footer`
  background: ${colors.neutral.ink};
  color: ${colors.neutral.white};
  padding-block: ${spacing.md};
`;

interface FooterProps {
  strings: Dictionary["footer"];
}

export const Footer = ({ strings }: FooterProps) => (
  <Bar>
    <Container size="lg">
      <Group justify="space-between" gap="sm">
        <Text size="sm">{strings.rights}</Text>
        <Group gap="md">
          {/* Latin text inside a possibly right-to-left line. */}
          <Anchor
            href={`mailto:${CONTACT_EMAIL}`}
            c="white"
            size="sm"
            dir="ltr"
          >
            {CONTACT_EMAIL}
          </Anchor>
          <Anchor
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            c="white"
            size="sm"
          >
            Instagram
          </Anchor>
        </Group>
      </Group>
    </Container>
  </Bar>
);
