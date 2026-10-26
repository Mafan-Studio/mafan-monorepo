"use client";

import styled from "@emotion/styled";
import { Container, Stack, Text, Title } from "@mantine/core";
import type { Locale } from "@mafan/types";
import { colors, spacing } from "@mafan/tokens";
import type { Dictionary } from "@/i18n/getDictionary";
import { Section } from "./Section";
import { ClockIcon, STEP_ICONS } from "./StepIcons";

const ICON_SIZE = 64;
const COLUMN_GAP = 16;

// A vertical path on phones, a horizontal one from 62em up. Connector lines
// use logical properties, so they run right-to-left on Persian pages.
const Steps = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 28px;

  @media (min-width: 62em) {
    grid-template-columns: repeat(5, 1fr);
    gap: ${COLUMN_GAP}px;
  }
`;

const Step = styled.li`
  position: relative;
  display: grid;
  grid-template-columns: ${ICON_SIZE}px 1fr;
  column-gap: ${spacing.sm};
  align-items: start;
  align-content: start;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    inset-inline-start: ${ICON_SIZE / 2 - 1}px;
    top: ${ICON_SIZE + 8}px;
    bottom: -20px;
    border-inline-start: 2px dashed ${colors.pink.deep};
  }

  @media (min-width: 62em) {
    grid-template-columns: 1fr;
    justify-items: center;
    row-gap: 12px;
    text-align: center;

    &:not(:last-child)::after {
      top: ${ICON_SIZE / 2 - 1}px;
      bottom: auto;
      inset-inline-start: calc(50% + ${ICON_SIZE / 2 + 12}px);
      inset-inline-end: calc(-50% - ${COLUMN_GAP}px + ${ICON_SIZE / 2 + 12}px);
      border-inline-start: none;
      border-top: 2px dashed ${colors.pink.deep};
    }
  }
`;

const IconCircle = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  width: ${ICON_SIZE}px;
  height: ${ICON_SIZE}px;
  border-radius: 50%;
  background: ${colors.neutral.white};
  color: ${colors.pink.deep};
  box-shadow: 0 4px 14px rgba(224, 111, 160, 0.25);
`;

const StepNumber = styled.span`
  position: absolute;
  inset-block-start: -4px;
  inset-inline-end: -4px;
  display: grid;
  place-items: center;
  min-width: 24px;
  height: 24px;
  padding-inline: 4px;
  border-radius: 12px;
  background: ${colors.neutral.ink};
  color: ${colors.neutral.white};
  font-size: 13px;
  font-weight: 600;
`;

const Timing = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin: ${spacing.lg} auto 0;
  padding-block: 10px;
  padding-inline: 20px;
  border-radius: 999px;
  background: ${colors.neutral.white};
  color: ${colors.neutral.ink};
  font-weight: 500;
  text-align: center;
`;

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
        <Stack align="center" gap="xs" mb="xl">
          <Title order={2} id="how-it-works-title" ta="center">
            {strings.title}
          </Title>
          <Text ta="center" c={colors.neutral.secondaryInk}>
            {strings.intro}
          </Text>
        </Stack>
        <Steps>
          {strings.steps.map((step, index) => {
            const StepIcon = STEP_ICONS[index]!;
            return (
              <Step key={step.title}>
                <IconCircle>
                  <StepIcon />
                  <StepNumber aria-hidden="true">
                    {formatNumber(index + 1)}
                  </StepNumber>
                </IconCircle>
                <div>
                  <Text fw={600} mb={4}>
                    {step.title}
                  </Text>
                  <Text size="sm" c={colors.neutral.secondaryInk}>
                    {step.text}
                  </Text>
                </div>
              </Step>
            );
          })}
        </Steps>
        <Timing>
          <ClockIcon />
          {strings.timing}
        </Timing>
      </Container>
    </Section>
  );
};
