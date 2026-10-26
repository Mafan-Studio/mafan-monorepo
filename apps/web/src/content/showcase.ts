// Hand-picked drawing -> sculpture pairs shown near the top of the landing
// page. Captions and alt text live in the dictionaries under
// `showcase.items.<slug>`.
//
// Photos live in public/showcase/ as 4:5 WebP files. Children's names and
// teachers' notes written on the drawings are removed before they go in.
export const SHOWCASE_ITEMS = [
  {
    slug: "giraffe",
    drawing: "/showcase/giraffe-drawing.webp",
    sculpture: "/showcase/giraffe-sculpture.webp",
  },
  {
    slug: "rainbow-cat",
    drawing: "/showcase/rainbow-cat-drawing.webp",
    sculpture: "/showcase/rainbow-cat-sculpture.webp",
  },
  {
    slug: "fox",
    drawing: "/showcase/fox-drawing.webp",
    sculpture: "/showcase/fox-sculpture.webp",
  },
] as const;

export type ShowcaseSlug = (typeof SHOWCASE_ITEMS)[number]["slug"];
