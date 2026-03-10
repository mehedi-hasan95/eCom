"use client";
import { useProductFilters } from "@/hooks/nuqs/use-nuqs";
import { Field, FieldLabel } from "@workspace/ui/components/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const sortData = [
  {
    title: "Trending",
    value: "trending",
  },
  {
    title: "Populer",
    value: "populer",
  },
  {
    title: "New Product",
    value: "new",
  },
  {
    title: "Old Product",
    value: "old",
  },
  {
    title: "Sort by Name (A–Z)",
    value: "ascByName",
  },
  {
    title: "Sort by Name (Z–A)",
    value: "dscByName",
  },
  {
    title: "Price: Low to High (0–9)",
    value: "ascByPrice",
  },
  {
    title: "Price: High to Low (9–0)",
    value: "dscByPrice",
  },
];
export const SortFilter = () => {
  const [filter, setFilter] = useProductFilters();
  return (
    <Field className="w-full">
      <FieldLabel>Sort</FieldLabel>
      <Select
        value={filter.sort ?? "trending"}
        onValueChange={(value) =>
          setFilter({
            ...filter,
            sort: value as
              | "trending"
              | "populer"
              | "old"
              | "new"
              | "ascByName"
              | "dscByName"
              | "ascByPrice"
              | "dscByPrice",
          })
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortData.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
};
