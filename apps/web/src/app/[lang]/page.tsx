import { notFound } from "next/navigation";
import { isLocale } from "@mafan/types";
import { About } from "@/components/About";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { GetInTouch } from "@/components/GetInTouch";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { InstagramFeed } from "@/components/InstagramFeed";
import { Showcase } from "@/components/Showcase";
import { LEGAL } from "@/content/site";
import { getDictionary } from "@/i18n/getDictionary";
import { getInstagramPosts } from "@/lib/instagram";

// Static per language, regenerated at most hourly so new Instagram posts
// show up without a redeploy. A failed regeneration keeps serving the last
// good page.
export const revalidate = 3600;

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) {
    notFound();
  }
  const dictionary = getDictionary(lang);
  const posts = await getInstagramPosts();

  return (
    <>
      <Header lang={lang} strings={dictionary.header} />
      <main>
        <Hero strings={dictionary.hero} />
        <Showcase strings={dictionary.showcase} />
        <HowItWorks lang={lang} strings={dictionary.howItWorks} />
        <About strings={dictionary.about} />
        <InstagramFeed posts={posts} strings={dictionary.instagram} />
        <Faq strings={dictionary.faq} />
        <GetInTouch
          lang={lang}
          strings={dictionary.contact}
          formStrings={dictionary.form}
        />
      </main>
      <Footer lang={lang} legal={LEGAL} strings={dictionary.footer} />
    </>
  );
}
