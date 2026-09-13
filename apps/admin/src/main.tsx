import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import { colors, fonts } from "@mafan/tokens";
import { App } from "./App.tsx";

const theme = createTheme({
  primaryColor: "dark",
  white: colors.white,
  black: colors.black,
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
