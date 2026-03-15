"use client";

import { useState, useEffect } from "react";
import { Slider } from "@workspace/ui/components/slider";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@/hooks/use-debounce";

interface Props {
  minPrice?: number | null;
  maxPrice?: number | null;
  maxLimit: number;
  onMinPriceChange: (value: number | null) => void;
  onMaxPriceChange: (value: number | null) => void;
}

export const PriceFilter = ({
  minPrice,
  maxPrice,
  maxLimit,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) => {
  const absoluteMin = 0;
  const absoluteMax = maxLimit;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ?? absoluteMin,
    maxPrice ?? absoluteMax,
  ]);

  const debouncedMin = useDebounce(priceRange[0], 400);
  const debouncedMax = useDebounce(priceRange[1], 400);

  useEffect(() => {
    onMinPriceChange(debouncedMin === absoluteMin ? null : debouncedMin);
  }, [debouncedMin, absoluteMin, onMinPriceChange]);

  useEffect(() => {
    onMaxPriceChange(debouncedMax === absoluteMax ? null : debouncedMax);
  }, [debouncedMax, absoluteMax, onMaxPriceChange]);

  useEffect(() => {
    setPriceRange([minPrice ?? absoluteMin, maxPrice ?? absoluteMax]);
  }, [minPrice, maxPrice, absoluteMin, absoluteMax]);

  const handleSliderChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;

    setPriceRange(([_, max]) => [
      Math.min(Math.max(value, absoluteMin), max),
      max,
    ]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value) || 0;

    setPriceRange(([min, _]) => [
      min,
      Math.min(Math.max(value, min), absoluteMax),
    ]);
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Price Filter</Label>

      <Slider
        value={priceRange}
        onValueChange={handleSliderChange}
        min={absoluteMin}
        max={absoluteMax}
        step={1}
        className="w-full"
      />

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Min {absoluteMin}</span>
        <span>Max {absoluteMax}</span>
      </div>

      <div className="flex gap-4">
        <div className="space-y-2 w-full">
          <Label htmlFor="min-price">Min</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>

            <Input
              id="min-price"
              type="number"
              value={priceRange[0]}
              min={absoluteMin}
              max={priceRange[1]}
              step={1}
              onChange={handleMinInputChange}
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="max-price">Max</Label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>

            <Input
              id="max-price"
              type="number"
              value={priceRange[1]}
              min={priceRange[0]}
              max={absoluteMax}
              step={1}
              onChange={handleMaxInputChange}
              className="pl-7"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
