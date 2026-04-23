import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Community Seller Hub",
  description: "Discover local sellers and products near you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
