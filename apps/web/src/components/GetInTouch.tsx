"use client";

import {
  Button,
  Card,
  Container,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import type { Locale } from "@mafan/types";
import { colors } from "@mafan/tokens";
import { INSTAGRAM_DM_URL } from "@/content/site";
import type { Dictionary } from "@/i18n/getDictionary";
import { InquiryForm } from "./InquiryForm";
import { InstagramIcon } from "./InstagramIcon";
import { Section } from "./Section";

interface GetInTouchProps {
  lang: Locale;
  strings: Dictionary["contact"];
  formStrings: Dictionary["form"];
}

export const GetInTouch = ({ lang, strings, formStrings }: GetInTouchProps) => (
  <Section tone="pink" aria-labelledby="contact-title">
    <Container size="lg">
      <Stack align="center" gap="xs" mb="xl">
        <Title order={2} id="contact-title" ta="center">
          {strings.title}
        </Title>
        <Text ta="center" c={colors.neutral.secondaryInk}>
          {strings.intro}
        </Text>
      </Stack>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Card
          radius="lg"
          padding="xl"
          withBorder
          style={{ alignSelf: "start" }}
        >
          <Stack gap="md" align="flex-start">
            <Title order={3}>{strings.dmTitle}</Title>
            <Text c={colors.neutral.secondaryInk}>{strings.dmText}</Text>
            <Button
              component="a"
              href={INSTAGRAM_DM_URL}
              target="_blank"
              rel="noopener noreferrer"
              color="dark"
              radius="xl"
              leftSection={<InstagramIcon size={18} />}
            >
              {strings.dmCta}
            </Button>
          </Stack>
        </Card>
        <Card radius="lg" padding="xl" withBorder id="inquiry">
          <Title order={3} mb="md">
            {strings.formTitle}
          </Title>
          <InquiryForm locale={lang} strings={formStrings} />
        </Card>
      </SimpleGrid>
    </Container>
  </Section>
);
