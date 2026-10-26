"use client";

import {
  Card,
  Container,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { colors } from "@mafan/tokens";
import { SHOWCASE_ITEMS } from "@/content/showcase";
import type { Dictionary } from "@/i18n/getDictionary";
import { Section } from "./Section";

interface ShowcaseProps {
  strings: Dictionary["showcase"];
}

interface LabelledImageProps {
  src: string;
  alt: string;
  label: string;
}

const LabelledImage = ({ src, alt, label }: LabelledImageProps) => (
  <Stack gap={6}>
    <Image
      src={src}
      alt={alt}
      radius="md"
      fit="cover"
      style={{ aspectRatio: "1" }}
    />
    <Text size="sm" c={colors.neutral.secondaryInk} ta="center">
      {label}
    </Text>
  </Stack>
);

export const Showcase = ({ strings }: ShowcaseProps) => (
  <Section tone="white" aria-labelledby="showcase-title">
    <Container size="lg">
      <Stack align="center" gap="xs" mb="xl">
        <Title order={2} id="showcase-title" ta="center">
          {strings.title}
        </Title>
        <Text ta="center" c={colors.neutral.secondaryInk}>
          {strings.intro}
        </Text>
      </Stack>
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg">
        {SHOWCASE_ITEMS.map((item) => {
          const itemStrings = strings.items[item.slug];
          return (
            <Card key={item.slug} withBorder radius="lg" padding="md">
              {/* Drawing first: on the left in English/Dutch, on the right
                  in Persian. Two columns from small screens up, stacked
                  on the narrowest phones. */}
              <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
                <LabelledImage
                  src={item.drawing}
                  alt={itemStrings.drawingAlt}
                  label={strings.drawingLabel}
                />
                <LabelledImage
                  src={item.sculpture}
                  alt={itemStrings.sculptureAlt}
                  label={strings.sculptureLabel}
                />
              </SimpleGrid>
              <Text fw={500} ta="center" mt="sm">
                {itemStrings.caption}
              </Text>
            </Card>
          );
        })}
      </SimpleGrid>
    </Container>
  </Section>
);
