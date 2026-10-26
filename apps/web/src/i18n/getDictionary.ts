import "server-only";
import type { Locale } from "@mafan/types";
import en from "./dictionaries/en.json";
import nl from "./dictionaries/nl.json";
import fa from "./dictionaries/fa.json";

export type Dictionary = typeof en;

// English defines the shape; a key missing from nl.json or fa.json is a
// type error here.
const dictionaries: Record<Locale, Dictionary> = { en, nl, fa };

export const getDictionary = (locale: Locale): Dictionary =>
  dictionaries[locale];
