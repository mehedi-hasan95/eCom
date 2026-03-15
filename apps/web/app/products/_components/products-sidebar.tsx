"use client";

import { useCallback } from "react";
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

  const onMinPriceChange = useCallback(
    (value: number | null) => {
      setFilters((prev) => ({
        ...prev,
        minPrice: value,
      }));
    },
    [setFilters],
  );

  const onMaxPriceChange = useCallback(
    (value: number | null) => {
      setFilters((prev) => ({
        ...prev,
        maxPrice: value,
      }));
    },
    [setFilters],
  );

  const onCatsChange = useCallback(
    (value: string[]) => {
      setFilters((prev) => ({
        ...prev,
        cats: value,
      }));
    },
    [setFilters],
  );

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
          onClick={clearFilter}
        >
          Reset
        </Button>
      </div>

      <div className="space-y-10">
        <SortFilter />

        <PriceFilter
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          maxLimit={highPrice}
          onMinPriceChange={onMinPriceChange}
          onMaxPriceChange={onMaxPriceChange}
        />

        <CategoryFilter value={filters.cats} onChange={onCatsChange} />
      </div>
    </div>
  );
};
