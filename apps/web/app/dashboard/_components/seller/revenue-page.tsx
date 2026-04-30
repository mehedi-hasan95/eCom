"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/common/modify/chart";

export const description = "A bar chart with a custom label";

const chartConfig = {
  total_sales: {
    label: "Total Prices",
    color: "var(--chart-2)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

interface Props {
  data:
    | { total_sales: number; total_quantity: number; month: Date }[]
    | undefined;
}
export const RevenuePage = ({ data }: Props) => {
  // 🔄 Transform API data
  const formattedData =
    data?.map((item) => ({
      month: new Date(item.month).toLocaleString("default", {
        month: "short",
      }),
      total_sales: item.total_sales,
      total_quantity: item.total_quantity,
    })) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Sales Report</CardTitle>
        <CardDescription>Last 12 months performance</CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            accessibilityLayer
            data={formattedData}
            layout="vertical"
            margin={{ right: 16 }}
          >
            <CartesianGrid horizontal={false} />

            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              hide
            />

            <XAxis dataKey="total_sales" type="number" hide />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            <Bar
              dataKey="total_sales"
              fill="var(--color-total_sales)"
              radius={4}
            >
              {/* Month label inside bar */}
              <LabelList
                dataKey="month"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={14}
              />

              {/* Quantity label outside bar */}
              <LabelList
                dataKey="total_quantity"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing sales and quantity for recent months
        </div>
      </CardFooter>
    </Card>
  );
};
