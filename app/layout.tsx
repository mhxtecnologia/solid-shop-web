import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";

import "../styles/globals.css";

import { Providers } from '@app/providers';
import { FloatingCartSummary } from '@components/layout/FloatingCartSummary';

import { Header } from "@components/layout/Header/Header";

import { Footer } from "@components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Stefanini Shop',
  description: 'E-commerce application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-background text-foreground`}
      >
        <Providers>
          <Header />
          <main className="flex-1 container pt-6 mx-auto px-4 lg:px-6">{children}</main>
          <Footer />
          <FloatingCartSummary />
        </Providers>
      </body>
    </html>
  );
}
