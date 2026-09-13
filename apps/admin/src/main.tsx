import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@fontsource/fredoka/300.css";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
import "@mafan/ui/global.css";
import "./index.css";
import { colors, fonts, toMantineShades } from "@mafan/tokens";
import { App } from "./App.tsx";

const theme = createTheme({
  primaryColor: "pink",
  autoContrast: true,
  colors: {
    pink: toMantineShades(colors.pink.soft, colors.pink.base, colors.pink.deep),
    yellow: toMantineShades(colors.yellow.soft, colors.yellow.base),
    blue: toMantineShades(colors.blue.soft, colors.blue.base),
    success: toMantineShades(colors.success.soft, colors.success.base),
    error: toMantineShades(colors.error.soft, colors.error.base),
  },
  white: colors.neutral.white,
  black: colors.neutral.ink,
  fontFamily: fonts.body,
  headings: { fontFamily: fonts.heading },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="light">
      <App />
    </MantineProvider>
  </StrictMode>,
);
