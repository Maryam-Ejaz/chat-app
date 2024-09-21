import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";

const lato = Lato({ subsets: ["latin"], weight:["400","900"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Echo",
    default: "Echo",
  },
  description: "🚀 Stay connected",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lato.className}>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          

          {children}

          
          <Toaster position="top-center" />
        </ThemeProvider>
        <Analytics />

      </body>
    </html>
  );
}
