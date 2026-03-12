"use client";

import { useProductFilters } from "@/hooks/nuqs/use-nuqs";
import { Button } from "@workspace/ui/components/button";
import { CategoryFilter } from "./products/category-filter";
import { SortFilter } from "./products/sort-filter";
import { PriceFilter } from "./products/price-filter";

interface Props {
  highPrice: number;
}
export const ProductsSidebar = ({ highPrice }: Props) => {
  const [filters, setFilters] = useProductFilters();

  const onChange = (key: keyof typeof filters, value: unknown) => {
    setFilters({ ...filters, [key]: value });
  };
  const clearFilter = () => {
    setFilters({
      maxPrice: null,
      minPrice: null,
      sort: null,
      cats: [],
      search: "",
    });
  };
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between px-5">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button
          variant="link"
          className="text-blue-600 p-0"
          onClick={() => clearFilter()}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-10 ">
        <SortFilter />
        <PriceFilter
          minPrice={0}
          maxPrice={highPrice}
          onMinPriceChange={(value) => onChange("minPrice", value)}
          onMaxPriceChange={(value) => onChange("maxPrice", value)}
        />
        <CategoryFilter
          value={filters.cats}
          onChange={(value) => onChange("cats", value)}
        />
      </div>
    </div>
  );
};
