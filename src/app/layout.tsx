import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Toaster } from "@/components/ui/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "모임 관리 시스템",
  description: "운영진을 위한 출석 및 규칙 관리 앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={inter.className + " min-h-screen bg-background text-foreground"}>
        <Nav />
        <main className="container mx-auto p-4 md:p-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
