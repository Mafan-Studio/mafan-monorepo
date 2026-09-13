export const colors = {
  brand: {
    pink: "#F6A9C4",
    yellow: "#F7CF61",
    blue: "#A9DCE5",
    ink: "#171717",
    warmWhite: "#FFFCF8",
  },
  pink: {
    soft: "#FDE4ED",
    base: "#F6A9C4",
    deep: "#D96D95",
  },
  yellow: {
    soft: "#FFF2BD",
    base: "#F7CF61",
  },
  blue: {
    soft: "#E1F4F7",
    base: "#A9DCE5",
  },
  neutral: {
    ink: "#171717",
    secondaryInk: "#45413F",
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
): [string, string, string, string, string, string, string, string, string, string] => [
  soft,
  soft,
  soft,
  soft,
  base,
  base,
  base,
  deep,
  deep,
  deep,
];

export const fonts = {
  body: "'Jost', sans-serif",
  heading: "'Jost', sans-serif",
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
