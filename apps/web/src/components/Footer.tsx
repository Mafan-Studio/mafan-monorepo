"use client";

import styled from "@emotion/styled";
import { Anchor, Container, Group, Stack, Text } from "@mantine/core";
import { colors, spacing } from "@mafan/tokens";
import { CONTACT_EMAIL, INSTAGRAM_PROFILE_URL } from "@/content/site";
import type { Dictionary } from "@/i18n/getDictionary";

const Bar = styled.footer`
  background: ${colors.neutral.ink};
  color: ${colors.neutral.warmWhite};
  padding-block: ${spacing.lg};
`;

const Logo = styled.img`
  display: block;
  height: 32px;
  width: auto;
`;

interface FooterProps {
  strings: Dictionary["footer"];
}

export const Footer = ({ strings }: FooterProps) => (
  <Bar>
    <Container size="lg">
      <Group justify="space-between" align="flex-end" gap="lg">
        <Stack gap="sm">
          <Logo src="/mafan-logo-light.svg" alt="Mafan Studio" />
          <Text size="sm" c={colors.neutral.border}>
            {strings.rights}
          </Text>
        </Stack>
        <Group gap="md">
          {/* Latin text inside a possibly right-to-left line. */}
          <Anchor
            href={`mailto:${CONTACT_EMAIL}`}
            c={colors.neutral.warmWhite}
            size="sm"
            dir="ltr"
          >
            {CONTACT_EMAIL}
          </Anchor>
          <Anchor
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            c={colors.neutral.warmWhite}
            size="sm"
          >
            Instagram
          </Anchor>
        </Group>
      </Group>
    </Container>
  </Bar>
);
