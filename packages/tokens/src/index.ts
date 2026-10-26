export const colors = {
  brand: {
    pink: "#F28CB7",
    pinkDeep: "#E06FA0",
    navy: "#1A1A2E",
    warmWhite: "#FFFCF8",
  },
  pink: {
    soft: "#FDE3EE",
    base: "#F28CB7",
    deep: "#E06FA0",
  },
  neutral: {
    ink: "#1A1A2E",
    secondaryInk: "#4A4A5E",
    white: "#FFFFFF",
    warmWhite: "#FFFCF8",
    warmCream: "#FFF6EE",
    border: "#E8DED5",
  },
  success: {
    base: "#274C3A",
    soft: "#E2EEE8",
  },
  error: {
    base: "#C84B55",
    soft: "#FBE7E9",
  },
} as const;

/**
 * Mantine's theme.colors needs exactly 10 shades per color. We only have
 * 2-3 real shades per brand color, so this repeats them into slots rather
 * than inventing intermediate hex values.
 */
export const toMantineShades = (
  soft: string,
  base: string,
  deep: string = base,
): [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
] => [soft, soft, soft, soft, base, base, base, deep, deep, deep];

// Fredoka has no Arabic-script glyphs, so Persian text falls back to
// Vazirmatn per character while Latin text keeps the Fredoka look.
export const fonts = {
  body: "'Fredoka', 'Vazirmatn', sans-serif",
  heading: "'Fredoka', 'Vazirmatn', sans-serif",
} as const;

export const spacing = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "40px",
  xl: "64px",
  xxl: "96px",
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
} as const;
