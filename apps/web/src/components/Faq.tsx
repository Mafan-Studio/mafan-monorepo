"use client";

import { Accordion, Container, Title } from "@mantine/core";
import { colors } from "@mafan/tokens";
import type { Dictionary } from "@/i18n/getDictionary";
import { Section } from "./Section";

interface FaqProps {
  strings: Dictionary["faq"];
}

export const Faq = ({ strings }: FaqProps) => (
  <Section tone="white" aria-labelledby="faq-title">
    <Container size="sm">
      <Title order={2} id="faq-title" ta="center" mb="lg">
        {strings.title}
      </Title>
      <Accordion variant="separated" radius="md">
        {strings.items.map((item) => (
          <Accordion.Item key={item.question} value={item.question}>
            <Accordion.Control>{item.question}</Accordion.Control>
            <Accordion.Panel c={colors.neutral.secondaryInk}>
              {item.answer}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  </Section>
);
