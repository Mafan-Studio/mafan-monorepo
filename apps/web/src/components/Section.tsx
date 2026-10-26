"use client";

import styled from "@emotion/styled";
import { colors, spacing } from "@mafan/tokens";

type SectionTone = "white" | "cream" | "pink";

const backgrounds: Record<SectionTone, string> = {
  white: colors.neutral.warmWhite,
  cream: colors.neutral.warmCream,
  pink: colors.pink.soft,
};

interface SectionProps {
  tone?: SectionTone;
}

// Logical properties only (padding-block etc.) so every section mirrors
// correctly on the right-to-left Persian pages.
export const Section = styled("section", {
  shouldForwardProp: (prop) => prop !== "tone",
})<SectionProps>`
  background: ${({ tone = "white" }) => backgrounds[tone]};
  padding-block: ${spacing.xl};

  @media (max-width: 48em) {
    padding-block: ${spacing.lg};
  }
`;
