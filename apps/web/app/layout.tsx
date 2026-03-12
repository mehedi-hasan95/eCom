import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import getQueryClient from "@/lib/query-client";
import { sessionAction } from "@/lib/actions/auth-server-action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getAllProductsAction } from "@/lib/actions/product-action";
import { getWishlistAction } from "@/lib/actions/wishlist-action";
import { Metadata } from "next";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["sessions"],
    queryFn: sessionAction,
  });
  await queryClient.prefetchQuery({
    queryKey: ["all-products"],
    queryFn: () => getAllProductsAction(),
  });
  await queryClient.prefetchQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlistAction,
  });
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}

/**
 * ============================================================
 * 📌 Metadata
 * ============================================================
 */

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "MultiMart",
      template: "%s | MultiMart",
    },
    description: "A multivendor Ecommerce website",
  };
}
