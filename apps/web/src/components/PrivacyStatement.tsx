"use client";

import { Anchor, Container, Stack, Text, Title } from "@mantine/core";
import type { Locale } from "@mafan/types";
import { colors } from "@mafan/tokens";
import type { Dictionary } from "@/i18n/getDictionary";

interface PrivacyStatementProps {
  lang: Locale;
  strings: Dictionary["privacy"];
}

export const PrivacyStatement = ({ lang, strings }: PrivacyStatementProps) => (
  <Container size="sm" py="xl">
    <Stack gap="lg">
      <div>
        <Title order={1} fz={{ base: 32, sm: 40 }} c={colors.neutral.ink}>
          {strings.title}
        </Title>
        <Text size="sm" c={colors.neutral.secondaryInk} mt="xs">
          {strings.updated}
        </Text>
      </div>
      <Text size="lg">{strings.intro}</Text>
      {strings.sections.map((section) => (
        <section key={section.heading}>
          <Title order={2} fz={22} mb="xs" c={colors.neutral.ink}>
            {section.heading}
          </Title>
          {section.paragraphs.map((paragraph) => (
            <Text key={paragraph} mb="sm" lh={1.6}>
              {paragraph}
            </Text>
          ))}
        </section>
      ))}
      <Anchor href={`/${lang}`}>{strings.back}</Anchor>
    </Stack>
  </Container>
);
