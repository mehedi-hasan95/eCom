"use client";

import { useProductFilters } from "@/hooks/nuqs/use-nuqs";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  placeholder?: string;
  className?: string;
}
export const SearchFilter = ({
  className,
  placeholder = "Search...",
}: Props) => {
  const [filters, setFilters] = useProductFilters();
  const [searchValue, setSearchValue] = useState(filters.search ?? "");

  const debouncedSearch = useDebounce(searchValue, 500);

  useEffect(() => {
    const normalized = debouncedSearch.trim();

    setFilters({
      search: normalized,
    });
  }, [debouncedSearch, setFilters]);

  return (
    <div className={cn("relative w-full lg:max-w-2xl", className)}>
      <Search className="absolute top-1/2 -translate-y-1/2 left-3 size-4" />
      <Input
        placeholder={placeholder}
        className="pl-8"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
    </div>
  );
};
