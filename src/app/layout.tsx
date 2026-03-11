import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Japoncu Sayman - En Kaliteli Oto Yedek Parça",
  description: "Japoncu Sayman, orijinal ve yan sanayi oto yedek parçaları.",
  icons: {
    icon: "/images/japoncu-sayman-logo.svg",
    shortcut: "/images/japoncu-sayman-logo.svg",
    apple: "/images/japoncu-sayman-logo.svg",
  },
};

import { AuthProvider } from "@/components/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${inter.variable} ${dmSans.variable} font-[family-name:var(--font-inter)] antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
