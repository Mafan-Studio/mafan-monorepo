import { createTheme } from "@mantine/core";
import { colors, fonts } from "@mafan/tokens";

export const theme = createTheme({
  primaryColor: "dark",
  colors: {
    dark: [
      colors.offWhite,
      colors.gray100,
      colors.gray300,
      colors.gray500,
      colors.gray700,
      colors.black,
      colors.black,
      colors.black,
      colors.black,
      colors.black,
    ],
  },
  white: colors.white,
  black: colors.black,
  fontFamily: fonts.body,
  headings: { fontFamily: fonts.heading },
  defaultRadius: "sm",
});
