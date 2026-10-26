"use client";

import styled from "@emotion/styled";
import { ActionIcon, Container, Group } from "@mantine/core";
import type { Locale } from "@mafan/types";
import { colors } from "@mafan/tokens";
import { INSTAGRAM_PROFILE_URL } from "@/content/site";
import type { Dictionary } from "@/i18n/getDictionary";
import { InstagramIcon } from "./InstagramIcon";
import { LanguageSwitcher } from "./LanguageSwitcher";

const Bar = styled.header`
  background: ${colors.neutral.warmWhite};
  border-block-end: 1px solid ${colors.neutral.border};
  padding-block: 12px;
`;

const Logo = styled.img`
  display: block;
  height: 36px;
  width: auto;

  @media (max-width: 30em) {
    height: 22px;
  }
`;

interface HeaderProps {
  lang: Locale;
  strings: Dictionary["header"];
}

export const Header = ({ lang, strings }: HeaderProps) => (
  <Bar>
    <Container size="lg">
      <Group justify="space-between" wrap="nowrap" gap="xs">
        <a href={`/${lang}`} aria-label={strings.homeLabel}>
          <Logo src="/mafan-logo.svg" alt="Mafan Studio" />
        </a>
        <Group gap={2} wrap="nowrap">
          <LanguageSwitcher current={lang} label={strings.languageLabel} />
          <ActionIcon
            component="a"
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={strings.instagramLabel}
            variant="subtle"
            color="dark"
            size="lg"
          >
            <InstagramIcon />
          </ActionIcon>
        </Group>
      </Group>
    </Container>
  </Bar>
);
