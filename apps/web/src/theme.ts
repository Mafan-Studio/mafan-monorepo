import { createTheme } from "@mantine/core";
import { colors, fonts, toMantineShades } from "@mafan/tokens";

export const theme = createTheme({
  primaryColor: "pink",
  autoContrast: true,
  colors: {
    pink: toMantineShades(colors.pink.soft, colors.pink.base, colors.pink.deep),
    success: toMantineShades(colors.success.soft, colors.success.base),
    error: toMantineShades(colors.error.soft, colors.error.base),
  },
  white: colors.neutral.white,
  black: colors.neutral.ink,
  fontFamily: fonts.body,
  headings: { fontFamily: fonts.heading },
  defaultRadius: "sm",
});
