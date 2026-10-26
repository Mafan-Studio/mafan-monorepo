"use client";

import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import styled from "@emotion/styled";
import { colors, spacing } from "@mafan/tokens";
import { INSTAGRAM_DM_URL } from "@/content/site";
import type { Dictionary } from "@/i18n/getDictionary";
import { InstagramIcon } from "./InstagramIcon";

const HeroSection = styled.section`
  background: linear-gradient(
    180deg,
    ${colors.neutral.warmWhite} 0%,
    ${colors.pink.soft} 100%
  );
  padding-block: ${spacing.xxl};

  @media (max-width: 48em) {
    padding-block: ${spacing.xl};
  }
`;

interface HeroProps {
  strings: Dictionary["hero"];
}

export const Hero = ({ strings }: HeroProps) => {
  return (
    <HeroSection>
      <Container size="sm">
        <Stack align="center" gap="lg">
          <Title
            order={1}
            ta="center"
            c={colors.neutral.ink}
            fz={{ base: 34, sm: 48 }}
          >
            {strings.title}
          </Title>
          <Text ta="center" c={colors.neutral.secondaryInk} size="lg">
            {strings.subtitle}
          </Text>
          <Group justify="center" gap="sm">
            <Button component="a" href="#inquiry" size="md" radius="xl">
              {strings.ctaForm}
            </Button>
            <Button
              component="a"
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              size="md"
              radius="xl"
              variant="outline"
              color="dark"
              leftSection={<InstagramIcon size={18} />}
            >
              {strings.ctaInstagram}
            </Button>
          </Group>
        </Stack>
      </Container>
    </HeroSection>
  );
};
