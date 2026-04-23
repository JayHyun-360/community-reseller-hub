import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/ui/BottomNav";

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
        <div className="min-h-screen bg-white text-zinc-900 flex overflow-x-hidden font-sans">
          <div className="flex-grow flex flex-col min-w-0">
            <Header />
            <main className="flex-grow">{children}</main>
          </div>
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
