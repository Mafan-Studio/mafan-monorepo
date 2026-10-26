"use client";

import styled from "@emotion/styled";
import { Anchor, Container, Group, Stack, Text } from "@mantine/core";
import { colors, spacing } from "@mafan/tokens";
import type { Locale } from "@mafan/types";
import {
  CONTACT_EMAIL,
  INSTAGRAM_PROFILE_URL,
  type LegalDetails,
} from "@/content/site";
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
  lang: Locale;
  legal: LegalDetails;
  strings: Dictionary["footer"];
}

export const Footer = ({ lang, legal, strings }: FooterProps) => {
  // Registration details Dutch law asks for; a detail not filled in yet is
  // left out rather than shown empty.
  const registration = [
    legal.address,
    legal.kvkNumber && `${strings.kvkLabel} ${legal.kvkNumber}`,
    legal.btwId && `${strings.btwLabel} ${legal.btwId}`,
  ].filter(Boolean);

  return (
    <Bar>
      <Container size="lg">
        <Group justify="space-between" align="flex-end" gap="lg">
          <Stack gap="sm" align="flex-start">
            <Logo src="/mafan-logo-light.svg" alt="Mafan Studio" />
            <Text size="sm" c={colors.neutral.border}>
              {strings.rights}
            </Text>
            {registration.length > 0 && (
              <Text size="sm" c={colors.neutral.border} dir="ltr">
                {registration.join(" · ")}
              </Text>
            )}
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
            <Anchor
              href={`/${lang}/privacy`}
              c={colors.neutral.warmWhite}
              size="sm"
            >
              {strings.privacyLink}
            </Anchor>
          </Group>
        </Group>
      </Container>
    </Bar>
  );
};
