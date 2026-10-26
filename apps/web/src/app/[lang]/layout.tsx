import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import "@mantine/core/styles.css";
import "@fontsource/fredoka/300.css";
import "@fontsource/fredoka/400.css";
import "@fontsource/fredoka/500.css";
import "@fontsource/fredoka/600.css";
import "@fontsource/fredoka/700.css";
// Arabic-script subset only: Persian characters fall back to it from
// Fredoka, and the browser only downloads it on pages that use them.
import "@fontsource/vazirmatn/arabic-400.css";
import "@fontsource/vazirmatn/arabic-500.css";
import "@fontsource/vazirmatn/arabic-700.css";
import "@mafan/ui/global.css";
import { SUPPORTED_LOCALES, isLocale } from "@mafan/types";
import { theme } from "@/theme";
import { EmotionRegistry } from "@/lib/EmotionRegistry";
import { getDictionary } from "@/i18n/getDictionary";
import { getDirection } from "@/i18n/locales";
import { SITE_URL } from "@/content/site";

export const dynamicParams = false;

export const generateStaticParams = () =>
  SUPPORTED_LOCALES.map((lang) => ({ lang }));

export const generateMetadata = async ({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> => {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }
  const dictionary = getDictionary(lang);

  return {
    metadataBase: new URL(SITE_URL),
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        nl: "/nl",
        fa: "/fa",
        "x-default": "/",
      },
    },
  };
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }
  const dir = getDirection(lang);

  return (
    <html lang={lang} dir={dir} {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
      </head>
      <body>
        <EmotionRegistry>
          <DirectionProvider initialDirection={dir} detectDirection={false}>
            <MantineProvider theme={theme} defaultColorScheme="light">
              {children}
            </MantineProvider>
          </DirectionProvider>
        </EmotionRegistry>
      </body>
    </html>
  );
}
