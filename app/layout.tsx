import type React from "react";
import type { Metadata } from "next";
import { AppWrapper } from "@/components/app-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Made with App Studio",
  description: "Pi Network app",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
