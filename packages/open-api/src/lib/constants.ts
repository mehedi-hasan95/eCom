export const slugify = (str: string) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const sortValues = [
  "trending",
  "populer",
  "old",
  "new",
  "ascByName",
  "dscByName",
  "ascByPrice",
  "dscByPrice",
] as const;

export type sortValueType = (typeof sortValues)[number];
