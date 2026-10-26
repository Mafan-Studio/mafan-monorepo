"use client";

import {
  Container,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import type { Locale } from "@mafan/types";
import { colors } from "@mafan/tokens";
import type { Dictionary } from "@/i18n/getDictionary";
import { Section } from "./Section";

interface HowItWorksProps {
  lang: Locale;
  strings: Dictionary["howItWorks"];
}

export const HowItWorks = ({ lang, strings }: HowItWorksProps) => {
  // Step numbers in the page's own digits (e.g. Persian ۱ ۲ ۳).
  const formatNumber = new Intl.NumberFormat(lang).format;

  return (
    <Section tone="pink" aria-labelledby="how-it-works-title">
      <Container size="lg">
        <Title order={2} id="how-it-works-title" ta="center" mb="xl">
          {strings.title}
        </Title>
        <SimpleGrid
          component="ol"
          cols={{ base: 1, sm: 2, md: 5 }}
          spacing="lg"
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {strings.steps.map((step, index) => (
            <Stack component="li" key={step.title} gap="xs" align="center">
              <ThemeIcon size={48} radius="xl" color="pink">
                <Text fw={700} fz="lg" c={colors.neutral.ink}>
                  {formatNumber(index + 1)}
                </Text>
              </ThemeIcon>
              <Text fw={600} ta="center">
                {step.title}
              </Text>
              <Text size="sm" ta="center" c={colors.neutral.secondaryInk}>
                {step.text}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
        <Text ta="center" fw={500} mt="xl">
          {strings.timing}
        </Text>
      </Container>
    </Section>
  );
};
