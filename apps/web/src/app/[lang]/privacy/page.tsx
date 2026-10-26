import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@mafan/types";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { PrivacyStatement } from "@/components/PrivacyStatement";
import { LEGAL } from "@/content/site";
import { getDictionary } from "@/i18n/getDictionary";

export const generateMetadata = async ({
  params,
}: PageProps<"/[lang]/privacy">): Promise<Metadata> => {
  const { lang } = await params;
  if (!isLocale(lang)) {
    return {};
  }
  const dictionary = getDictionary(lang);

  return {
    title: `${dictionary.privacy.title} · Mafan Studio`,
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: {
        en: "/en/privacy",
        nl: "/nl/privacy",
        fa: "/fa/privacy",
      },
    },
  };
};

export default async function Privacy({
  params,
}: PageProps<"/[lang]/privacy">) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }
  const dictionary = getDictionary(lang);

  return (
    <>
      <Header lang={lang} strings={dictionary.header} />
      <main>
        <PrivacyStatement lang={lang} strings={dictionary.privacy} />
      </main>
      <Footer lang={lang} legal={LEGAL} strings={dictionary.footer} />
    </>
  );
}
