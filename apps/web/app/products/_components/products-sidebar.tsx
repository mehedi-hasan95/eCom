"use client";

import { useProductFilters } from "@/hooks/nuqs/use-nuqs";
import { PriceSlider } from "./products/price-filter";
import { Button } from "@workspace/ui/components/button";
import { CategoryFilter } from "./products/category-filter";
import { SortFilter } from "./products/sort-filter";

export const ProductsSidebar = () => {
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
        <PriceSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
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
