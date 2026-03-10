import { sortValues } from "@workspace/open-api/lib/constants";
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

export const params = {
  minPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
  maxPrice: parseAsInteger.withOptions({ clearOnDefault: true }),
  cats: parseAsArrayOf(parseAsString)
    .withDefault([])
    .withOptions({ clearOnDefault: true }),
  sort: parseAsStringLiteral(sortValues).withDefault("trending"),
};

export const useProductFilters = () => {
  return useQueryStates(params);
};
