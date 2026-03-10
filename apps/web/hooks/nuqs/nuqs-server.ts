import { sortValues } from "@workspace/open-api/lib/constants";
import {
  createLoader,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const params = {
  minPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
  maxPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
  cats: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  sort: parseAsStringLiteral(sortValues).withDefault("trending"),
};

export const loadSearchParams = createLoader(params);
