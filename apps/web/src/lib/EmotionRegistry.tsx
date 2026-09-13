"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";

/**
 * Emotion inserts <style> tags on the client during render. In the App
 * Router, the server render and the client hydration pass don't agree on
 * that insertion without this registry, causing a hydration mismatch.
 * This collects styles inserted during SSR and flushes them into <head>
 * before hydration, per Next.js's documented Emotion integration.
 */
export const EmotionRegistry = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [{ cache, flush }] = useState(() => {
    const cache = createCache({ key: "mafan" });
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
};
