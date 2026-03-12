"use client";

import { useState, useEffect } from "react";
import { Slider } from "@workspace/ui/components/slider";
import { Label } from "@workspace/ui/components/label";
import { Input } from "@workspace/ui/components/input";
import { useDebounce } from "@/hooks/use-debounce";

interface Props {
  minPrice?: number | null;
  maxPrice?: number | null;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) => {
  const absoluteMin = minPrice ?? 0;
  const absoluteMax = maxPrice ?? 1000;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    absoluteMin,
    absoluteMax,
  ]);

  const debouncedMin = useDebounce(priceRange[0], 400);
  const debouncedMax = useDebounce(priceRange[1], 400);

  useEffect(() => {
    onMinPriceChange(debouncedMin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMin]);

  useEffect(() => {
    onMaxPriceChange(debouncedMax);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedMax]);

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
    <div className="space-y-2">
      <Label className="text-sm font-medium">Price Filter</Label>

      <div className="space-y-4">
        <Slider
          value={priceRange}
          onValueChange={handleSliderChange}
          min={absoluteMin}
          max={absoluteMax}
          step={1}
          className="mx-auto w-full max-w-xs"
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Min {absoluteMin}</span>
          <span>Max {absoluteMax}</span>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div className="space-y-2">
          <Label htmlFor="min-price-input">Minimum Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
            <Input
              id="min-price-input"
              type="number"
              value={priceRange[0]}
              onChange={handleMinInputChange}
              min={absoluteMin}
              max={priceRange[1]}
              step={1}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max-price-input">Maximum Price</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
            <Input
              id="max-price-input"
              type="number"
              value={priceRange[1]}
              onChange={handleMaxInputChange}
              min={priceRange[0]}
              max={absoluteMax}
              step={1}
              className="pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
