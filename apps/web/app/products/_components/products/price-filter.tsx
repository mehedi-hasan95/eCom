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

export const PriceSlider = ({
  onMaxPriceChange,
  onMinPriceChange,
  maxPrice,
  minPrice,
}: Props) => {
  const absoluteMin = 0;
  const absoluteMax = 2000;

  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPrice ?? 200,
    maxPrice ?? 800,
  ]);

  const debouncedMin = useDebounce(priceRange[0], 400);
  const debouncedMax = useDebounce(priceRange[1], 400);

  // prevent infinite loop
  useEffect(() => {
    if (debouncedMin !== minPrice) {
      onMinPriceChange(debouncedMin);
    }
  }, [debouncedMin]);

  useEffect(() => {
    if (debouncedMax !== maxPrice) {
      onMaxPriceChange(debouncedMax);
    }
  }, [debouncedMax]);

  const handleSliderChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const handleMinInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;

    const clampedValue = Math.min(Math.max(value, absoluteMin), priceRange[1]);

    setPriceRange([clampedValue, priceRange[1]]);
  };

  const handleMaxInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseFloat(e.target.value) || 0;

    const clampedValue = Math.min(Math.max(value, priceRange[0]), absoluteMax);

    setPriceRange([priceRange[0], clampedValue]);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Price Filter</Label>

      <div className="space-y-4">
        <Slider
          value={priceRange}
          onValueChange={handleSliderChange}
          max={absoluteMax}
          min={absoluteMin}
          step={10}
          className="mx-auto w-full max-w-xs"
        />

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Min {absoluteMin}</span>
          <span>Max {absoluteMax}</span>
        </div>
      </div>

      <div className="flex justify-between gap-4">
        {/* Min */}
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
              step={10}
              className="pl-8"
            />
          </div>
        </div>

        {/* Max */}
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
              step={10}
              className="pl-8"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
