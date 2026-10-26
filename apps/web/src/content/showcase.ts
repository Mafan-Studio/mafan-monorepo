// Hand-picked drawing -> sculpture pairs shown near the top of the landing
// page. Captions and alt text live in the dictionaries under
// `showcase.items.<slug>`.
//
// The images are neutral placeholders until the real photos arrive: to swap
// one in, drop the photo into public/showcase/ and update its path here.
export const SHOWCASE_ITEMS = [
  {
    slug: "giraffe",
    drawing: "/showcase/giraffe-drawing.svg",
    sculpture: "/showcase/giraffe-sculpture.svg",
  },
  {
    slug: "rainbow-cat",
    drawing: "/showcase/rainbow-cat-drawing.svg",
    sculpture: "/showcase/rainbow-cat-sculpture.svg",
  },
  {
    slug: "gecko",
    drawing: "/showcase/gecko-drawing.svg",
    sculpture: "/showcase/gecko-sculpture.svg",
  },
] as const;

export type ShowcaseSlug = (typeof SHOWCASE_ITEMS)[number]["slug"];
