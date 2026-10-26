"use client";

import { Container, Stack, Text, Title } from "@mantine/core";
import { colors } from "@mafan/tokens";
import type { Dictionary } from "@/i18n/getDictionary";
import { Section } from "./Section";

interface AboutProps {
  strings: Dictionary["about"];
}

export const About = ({ strings }: AboutProps) => (
  <Section tone="white" aria-labelledby="about-title">
    <Container size="sm">
      <Stack gap="md">
        <Title order={2} id="about-title" ta="center">
          {strings.title}
        </Title>
        {strings.paragraphs.map((paragraph) => (
          <Text
            key={paragraph}
            size="lg"
            ta="center"
            c={colors.neutral.secondaryInk}
          >
            {paragraph}
          </Text>
        ))}
      </Stack>
    </Container>
  </Section>
);
