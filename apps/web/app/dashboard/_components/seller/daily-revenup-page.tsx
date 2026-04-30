"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { CalendarIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/common/modify/chart";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

import { Calendar } from "@workspace/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";

import { useQuery } from "@tanstack/react-query";
import { getProductDailyReport } from "@/lib/actions/product-action";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  total_sales: {
    label: "Total Price",
    color: "var(--chart-1)",
  },
  total_quantity: {
    label: "Quantity",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface Props {
  data:
    | { total_sales: number; total_quantity: number; date: string }[]
    | undefined;
}
export function DailyRevenuePage({ data }: Props) {
  const [timeRange, setTimeRange] = React.useState("90d");

  const [dateRange, setDateRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>({});

  const filteredData = React.useMemo(() => {
    if (!data) return [];

    // ✅ Custom calendar range
    if (dateRange?.from) {
      return data.filter((item) => {
        const date = new Date(item.date);
        const from = dateRange.from!;
        const to = dateRange.to ?? new Date();

        return date >= from && date <= to;
      });
    }

    // ✅ Preset ranges
    if (timeRange === "all") return data;

    const referenceDate = new Date();

    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return data.filter((item) => {
      const date = new Date(item.date);
      return date >= startDate;
    });
  }, [data, timeRange, dateRange]);

  const descriptionText = dateRange?.from
    ? `Showing data from ${dateRange.from.toLocaleDateString()} - ${(dateRange.to ?? new Date()).toLocaleDateString()}`
    : timeRange === "all"
      ? "Showing data for all time"
      : timeRange === "90d"
        ? "Showing data for last 3 months"
        : timeRange === "30d"
          ? "Showing data for last 30 days"
          : "Showing data for last 7 days";

  return (
    <Card className="pt-0">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-3 border-b py-5">
        <div className="grid flex-1 gap-1">
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>{descriptionText}</CardDescription>
        </div>

        {/* ✅ Preset Select */}
        <Select
          value={timeRange}
          onValueChange={(value) => {
            setTimeRange(value);
            setDateRange({}); // reset calendar
          }}
        >
          <SelectTrigger className="w-[160px] rounded-lg">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ Calendar Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-[260px] justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {dateRange.from.toLocaleDateString()} -{" "}
                    {dateRange.to.toLocaleDateString()}
                  </>
                ) : (
                  dateRange.from.toLocaleDateString()
                )
              ) : (
                "Pick date range"
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={dateRange as any}
              onSelect={(range) => {
                setDateRange(range || {});
                setTimeRange("custom"); // override preset
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>

              <linearGradient id="fillQty" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="total_quantity"
              type="natural"
              fill="url(#fillQty)"
              stroke="var(--color-mobile)"
              stackId="a"
            />

            <Area
              dataKey="total_sales"
              type="natural"
              fill="url(#fillSales)"
              stroke="var(--color-desktop)"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
